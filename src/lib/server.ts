import { type Block, type RawBlock, sanitizeBlock } from './block.js';

import type {
	BlockObjectResponse,
	PageObjectResponse,
	UserObjectResponse
} from '@notionhq/client/build/src/api-endpoints.js';
import { sanitizePageProperties, type PageWithProperties } from './properties.js';

export type PageWithBlocks = PageWithProperties & { blocks: Block[] };
export class Notion {
	auth: string;
	headers: Record<string, string>;
	constructor(auth: string) {
		this.auth = auth;
		this.headers = {
			Authorization: `Bearer ${this.auth}`,
			'Notion-Version': '2022-06-28'
		};
	}
	listBlocks = async (block_id: string) => {
		const url = `https://api.notion.com/v1/blocks/${block_id}/children?page_size=200`;
		return fetch(url, {
			headers: this.headers
		}).then((response) => response.json().then((data) => data.results as BlockObjectResponse[]));
	};

	getRecursiveBlocks = async (block_id: string): Promise<RawBlock[]> => {
		return this.listBlocks(block_id).then((blocks) => {
			return Promise.all(
				blocks.map(async (block) => {
					if (block.archived || block.in_trash) {
						return undefined;
					}
					if (block.type === 'child_database') {
						const pages = await this.getDatabasePages(block.id);
						return Object.assign(block, { pages });
					}

					if (block.has_children) {
						return this.getRecursiveBlocks(block.id).then((children) => {
							return Object.assign(block, { children });
						});
					} else {
						return Object.assign(block, { children: [] });
					}
				})
			).then((blocks) => blocks.filter((block) => block !== undefined));
		});
	};

	getPageContent = (block_id: string) => {
		return this.getRecursiveBlocks(block_id).then((blocks) => {
			return blocks.reduce(sanitizeBlock, []);
		});
	};

	getDatabasePages = (database_id: string) => {
		return fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
			method: 'POST',
			headers: Object.assign(
				{
					contentType: 'application/json'
				},
				this.headers
			),
			body: JSON.stringify({
				page_size: 100
			})
		}).then((response) => {
			return response.json().then((data: { results: PageObjectResponse[] }) => {
				return Promise.all((data?.results || []).map((page) => sanitizePageProperties(page, this)));
			});
		});
	};

	getUser = (user_id: string) => {
		return fetch(`https://api.notion.com/v1/users/${user_id}`, {
			headers: this.headers
		}).then((response) => response.json() as Promise<UserObjectResponse>);
	};

	getPage = async (block_id: string) => {
		return fetch(`https://api.notion.com/v1/pages/${block_id}`, {
			headers: this.headers
		}).then((response) =>
			response.json().then((data) => sanitizePageProperties(data as PageObjectResponse, this))
		);
	};
}

export const getPage = async ({
	auth,
	id
}: {
	auth: string;
	id: string;
}): Promise<PageWithBlocks> => {
	const notion = new Notion(auth);
	return Promise.all([notion.getPage(id), notion.getPageContent(id)]).then(([page, blocks]) => {
		return Object.assign(page, { blocks });
	});
};

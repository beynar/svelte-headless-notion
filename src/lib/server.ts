import { type Block, type RawBlock, sanitizeBlocks } from './block.js';

import type {
	BlockObjectResponse,
	DatabaseObjectResponse,
	PageObjectResponse,
	QueryDatabaseParameters,
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
					if (block.type === 'child_page') {
						const page = await this.getPage(block.id);
						return Object.assign(block, { page });
					}
					if (block.type === 'link_to_page') {
						if (block.link_to_page.type === 'page_id') {
							const page = await this.getPage(block.link_to_page.page_id);
							return Object.assign(block, { page });
						} else if (block.link_to_page.type === 'database_id') {
							const database = await this.getDatabase(block.link_to_page.database_id);
							return Object.assign(block, { page: database });
						} else {
							return block;
						}
					}

					if (block.type === 'synced_block' && block.synced_block.synced_from?.block_id) {
						const children = await this.getRecursiveBlocks(block.synced_block.synced_from.block_id);
						return Object.assign(block, { children });
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
		return this.getRecursiveBlocks(block_id).then(sanitizeBlocks);
	};

	getDatabasePages = (database_id: string, filter?: QueryDatabaseParameters['filter']) => {
		return fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
			method: 'POST',
			headers: Object.assign(
				{
					contentType: 'application/json'
				},
				this.headers
			),
			body: JSON.stringify({
				page_size: 100,
				filter
			})
		}).then((response) => {
			return response.json().then((data: { results: PageObjectResponse[] }) => {
				console.log(data);
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
			response.json().then((data: PageObjectResponse) => sanitizePageProperties(data, this))
		);
	};
	getDatabase = async (block_id: string) => {
		return fetch(`https://api.notion.com/v1/pages/${block_id}`, {
			headers: this.headers
		}).then((response) =>
			response.json().then((data: PageObjectResponse) => sanitizePageProperties(data, this))
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
export const findPage = async ({
	auth,
	database_id,
	filter
}: {
	auth: string;
	database_id: string;
	filter?: QueryDatabaseParameters['filter'];
}) => {
	const notion = new Notion(auth);
	const [page] = (await notion.getDatabasePages(database_id, filter)) || [];

	if (!page) {
		return null;
	}
	const blocks = await notion.getPageContent(page.id);
	return Object.assign(page, { blocks });
};

import { dev } from '$app/environment';
import { PRIVATE_NOTION_TOKEN } from '$env/static/private';
import { getPage, type PageWithBlocks } from '$lib/server.js';

const pageId = '10b1ca42e1a8800caab2e6a73c3c11d0';

const getFromOrigin = () => {
	return getPage({
		auth: PRIVATE_NOTION_TOKEN,
		id: pageId
	});
};
import { Client } from '@notionhq/client';
const notion = new Client({ auth: PRIVATE_NOTION_TOKEN });

// const res = await notion.databases.retrieve({ database_id: pageId });
const setInCache = (platform: App.Platform, page: PageWithBlocks) => {
	return platform.env.SVELTE_NOTION.put(pageId, JSON.stringify(page), {
		metadata: {
			// One minute
			expiration: Date.now() + 1000 * 60
		}
	});
};

export async function load({ platform }) {
	if (dev) {
		return {
			page: await getFromOrigin()
		};
	}
	const cachedValue = await platform?.env.SVELTE_NOTION.getWithMetadata<
		PageWithBlocks,
		{ expiration: number }
	>(pageId, 'json');

	const isStale = cachedValue && (cachedValue.metadata?.expiration || Infinity) < Date.now();

	const page = cachedValue?.value || (await getFromOrigin());

	if (isStale || !cachedValue?.value) {
		platform?.context.waitUntil(setInCache(platform, page));
	}

	return {
		page
	};
}

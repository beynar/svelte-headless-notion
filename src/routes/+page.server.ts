import { dev } from '$app/environment';
import { PRIVATE_NOTION_TOKEN } from '$env/static/private';
import { getPage, type PageWithBlocks } from '$lib/server.js';

const pageId = '1101bef5d90b808898cae7f233c58bd6';

const getFromOrigin = () => {
	return getPage({
		auth: PRIVATE_NOTION_TOKEN,
		id: pageId
	});
};

const setInCache = async (platform: App.Platform) => {
	return platform.env.SVELTE_NOTION.put(pageId, JSON.stringify(await getFromOrigin()), {
		metadata: {
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
		platform?.context.waitUntil(setInCache(platform));
	}

	return {
		page
	};
}

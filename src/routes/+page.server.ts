import { PRIVATE_NOTION_TOKEN } from '$env/static/private';
import { getPage, type PageWithBlocks } from '../lib/server.js';
const pageId = '10b1ca42e1a8800caab2e6a73c3c11d0';
const getFromOrigin = () => {
	return getPage({
		auth: PRIVATE_NOTION_TOKEN,
		id: pageId
	});
};
export async function load({ platform }) {
	const cachedValue = await platform?.env.SVELTE_NOTION.getWithMetadata<
		PageWithBlocks,
		{ expiration: number }
	>(pageId, 'json');

	const isStale = cachedValue && (cachedValue.metadata?.expiration || Infinity) < Date.now();

	const page = cachedValue?.value || (await getFromOrigin());

	if (isStale || !cachedValue) {
		platform?.context.waitUntil(
			platform?.env.SVELTE_NOTION.put(pageId, JSON.stringify(origin), {
				metadata: {
					expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
				}
			}).then((res) => {
				console.log({ res });
			})
		);
	}
	console.log({ cachedValue, isStale });
	return {
		page
	};
}

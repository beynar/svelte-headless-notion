import { PRIVATE_NOTION_TOKEN } from '$env/static/private';
import { getPage, type PageWithBlocks } from '../lib/server.js';
const getFromOrigin = () => {
	return getPage({
		auth: PRIVATE_NOTION_TOKEN,
		id: '10b1ca42e1a8800caab2e6a73c3c11d0'
	});
};
export async function load({ platform }) {
	const page_test = await getFromOrigin();
	return {
		page: page_test
	};
	const cacheKey = new Request('https://10b1ca42e1a8800caab2e6a73c3c11d0.notion.co');
	const cachedValue = await platform?.caches.default.match(cacheKey);
	const isStale =
		cachedValue && Date.now() > new Date(cachedValue.headers.get('expires') || '').getTime();
	if (cachedValue && !isStale) {
		return {
			page: cachedValue
		};
	}

	console.log({ isStale, cachedValue });

	const page = await getFromOrigin();
	// const page = cachedValue ? ((await cachedValue.json()) as PageWithBlocks) : await getFromOrigin();

	if (isStale || !cachedValue) {
		platform?.context.waitUntil(
			new Promise(async (resolve) => {
				const origin = await getFromOrigin();
				await platform?.caches.default.put(
					cacheKey,
					new Response(JSON.stringify(origin), {
						headers: {
							expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
						}
					})
				);
				resolve(true);
			})
		);
	}
	console.log({ isStale, cachedValue });
	return {
		page
	};
}

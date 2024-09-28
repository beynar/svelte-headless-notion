# Svelte-notion

Headless Notion page rendering engine for Svelte.
Simply fetch a page and render it as you want with snippets.
Lightweight, fully typed and no runtime dependencies.

## Install

```bash
pnpm add svelte-headless-notion
```

```bash
npm install svelte-headless-notion
```

## Documentation and example

The documentation [Here](https://svelte-headless-notion.pages.dev) is a notion page itself rendered with this librairie. The source code of this page is [Here](https://github.com/beynar/svelte-headless-notion/blob/master/src/routes/%2Bpage.svelte)

## Prerequisites

- Notion API token
- Svelte >= 5.0

## Usage

```ts
// src/routes/+page.server.ts
import { getPage } from 'svelte-headless-notion/server';

export const load = async () => {
	// This very slow you will obsiously want to chache it somewhere and make a custom SWR logic.
	const page = await getPage({
		auth: PRIVATE_NOTION_API_TOKEN,
		id: 'THE_PAGE_ID'
	});

	return {
		page
	};
};
```

```svelte
<!--  src/routes/+page.svelte -->
<script lang="ts">
	import Page from 'svelte-headless-notion';
	let { data } = $props();
</script>

<Page page={data.data}>
	<!-- Example snippet to render a paragraph block -->
	{#snippet paragraph({ block, children, content })}
		<div>
			<p>
				{@render content()}
			</p>
			{@render children()}
		</div>
	{/snippet}
	<!-- Define other block snippet here (callout, image, pdf, child_database, etc...) -->
</Page>
```

## License

MIT

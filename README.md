# Svelte-notion

Headless Notion for Svelte.
Simply fetch a page and render it as you want with snippets.

## Install

```bash
npm install svelte-headless-notion
```

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
	{#snippet paragraph({ block, children, content })}
		<div>
			<p>
				{@render content()}
			</p>
			{@render children()}
		</div>
	{/snippet}
	<!-- Define other block snippet here -->
</Page>
```

## License

MIT

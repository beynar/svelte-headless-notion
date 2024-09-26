# Svelte-notion

Headless Notion for Svelte.
Simply fetch a page and render it as you want with snippets.

## Install

```bash
npm install svelte-notion
```

## Prerequisites

- Notion API token
- Svelte >= 5.0

## Usage

```ts
// src/routes/+page.server.ts
import { getPage } from 'svelte-notion/server';

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
<script lang="ts">
	import Page from 'svele-notion';
	let { page } = $props();
</script>

// src/routes/+page.svelte
<Page {page}>
	{#snippet paragraph({ block, children, content })}
		<div>
			<p>
				{@render content()}
			</p>
			{@render children()}
		</div>
	{/snippet}

	<!-- Define other snippets here -->
</Page>
```

## License

MIT

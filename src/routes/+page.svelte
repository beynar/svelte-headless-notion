<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/notion-blocks.css';
	import NotionPage from '$lib/Page.svelte';

	let { data } = $props();

	if (browser) {
		console.log(data);
	}
</script>

<NotionPage page={data.page}>
	{#snippet bold({ children })}
		<strong>
			{@render children()}
		</strong>
	{/snippet}
	{#snippet italic({ children })}
		<em>
			{@render children()}
		</em>
	{/snippet}
	{#snippet strikethrough({ children })}
		<s>
			{@render children()}
		</s>
	{/snippet}
	{#snippet underline({ children })}
		<u>
			{@render children()}
		</u>
	{/snippet}
	{#snippet inlineCode({ children })}
		<u>
			{@render children()}
		</u>
	{/snippet}
	{#snippet color({ children, color })}
		<span style="color: var(--notion-{color})">
			{@render children()}
		</span>
	{/snippet}
</NotionPage>

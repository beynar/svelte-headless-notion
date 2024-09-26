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
	{#snippet marks({ mark, children })}
		{#if mark.bold}
			<strong>
				{@render children()}
			</strong>
		{:else if mark.italic}
			<em>
				{@render children()}
			</em>
		{:else if mark.strikethrough}
			<s>
				{@render children()}
			</s>
		{:else if mark.underline}
			<u>
				{@render children()}
			</u>
		{:else if mark.code}
			<code>
				{@render children()}
			</code>
		{:else if mark.color}
			<span style="color: {mark.color}">
				{@render children()}
			</span>
		{/if}
	{/snippet}
</NotionPage>

<style>
	code {
		font-size: 0.9rem;
		background-color: #ededed;
		/* padding: 0.1rem 0.2rem; */
		border-radius: 0.2rem;
	}
	:global(code + code) {
		padding-left: 10px;
		padding-right: 10px;
	}
</style>

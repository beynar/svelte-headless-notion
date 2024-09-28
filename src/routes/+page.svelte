<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import Text from '$lib/Text.svelte';
	import Page from '$lib/Page.svelte';

	let { data } = $props();

	if (browser) {
		console.log(data);
	}

	import hljs from 'highlight.js/lib/core';
	import html from 'highlight.js/lib/languages/xml';
	import typescript from 'highlight.js/lib/languages/typescript';
	import 'highlight.js/styles/codepen-embed.css';
	hljs.registerLanguage('html', html);
	hljs.registerLanguage('typescript', typescript);

	const hightlight = (node: HTMLElement) => {
		hljs.highlightElement(node);
	};
</script>

{#snippet gh()}
	<a href="https://github.com/beynar/svelte-headless-notion" target="_blank" class="contents">
		<svg
			height="32"
			aria-hidden="true"
			viewBox="0 0 24 24"
			version="1.1"
			width="32"
			data-view-component="true"
			class="fill-current"
		>
			<path
				d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"
			></path>
		</svg>
		<span>GitHub</span>
	</a>
{/snippet}

<Page page={data.page}>
	{#snippet header({ page })}
		<div class="grid content-center mb-10 relative">
			<div
				class="absolute w-fit h-fit top-2 right-2 text-white flex justify-center items-center gap-2"
			>
				{@render gh()}
			</div>

			<img
				style="grid-area: 1 / 1"
				src={page.cover}
				alt=""
				class="aspect-video w-full h-[220px] m-0"
			/>
			<div
				style="grid-area: 1 / 1"
				class="grid text-4xl font-sans font-bold content-center text-center bg-slate-600 bg-blend-color-dodge bg-opacity-10"
			>
				<h1 class="w-full h-full text-white m-0">
					<Text content={page.title} />
				</h1>
			</div>
		</div>
	{/snippet}
	{#snippet wrapper({ children })}
		<div class="prose mx-auto !max-w-screen-lg px-2 py-20">
			{@render children()}
		</div>
	{/snippet}
	{#snippet inlineCode({ children })}
		<kbd>
			{@render children()}
		</kbd>
	{/snippet}
	{#snippet code({ content, block })}
		<pre class="no-prose language-{block.language}" use:hightlight><code class="language-html"
				>{@render content()}</code
			></pre>
	{/snippet}
	{#snippet footer()}
		<div class="flex justify-center gap-2 items-center py-10">
			{@render gh()}
		</div>
	{/snippet}
</Page>

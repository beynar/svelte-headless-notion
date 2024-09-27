<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import Page from '$lib/Page.svelte';
	import Text from '$lib/Text.svelte';

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

	const hightlight = (node: HTMLElement, language: any) => {
		hljs.highlightElement(node, { language });
	};
</script>

<Page page={data.page} class="prose mx-auto !max-w-screen-lg px-2 py-20">
	{#snippet header({ page })}
		<div class="grid content-center mb-10">
			<img
				style="grid-area: 1 / 1"
				src={page.cover}
				alt=""
				class="aspect-video w-full h-[220px] rounded m-0"
			/>
			<div
				style="grid-area: 1 / 1"
				class="grid content-center text-center bg-slate-600 bg-blend-color-dodge bg-opacity-10"
			>
				<h1 class="w-full h-full text-white m-0">
					<Text content={page.title} />
				</h1>
			</div>
		</div>
	{/snippet}
	{#snippet code({ content, block })}
		<pre class="no-prose" use:hightlight={block.language}><code class="language-html"
				>{@render content()}</code
			></pre>
	{/snippet}
</Page>

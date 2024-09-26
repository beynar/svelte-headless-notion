<script lang="ts">
	import type { Mark, Marks, RichText } from './richtext.js';
	import NotionMarks from './Marks.svelte';
	import type { Snippet } from 'svelte';
	import { getPageContext } from './Page.svelte';

	const {
		mark,
		content,
		index,
		marks,
		nextMark
	}: { marks: Marks; content: string | Snippet; nextMark?: Mark; index: number; mark: Mark } =
		$props();

	const page = getPageContext();
</script>

{#snippet defaultMarks({ mark, children }: { mark: Mark; children: Snippet })}
	{#if mark.bold}
		<strong data-sn-bold>
			{@render children()}
		</strong>
	{:else if mark.italic}
		<em data-sn-italic>
			{@render children()}
		</em>
	{:else if mark.strikethrough}
		<s data-sn-strikethrough>
			{@render children()}
		</s>
	{:else if mark.underline}
		<u data-sn-underline>
			{@render children()}
		</u>
	{:else if mark.code}
		<code data-sn-code>
			{@render children()}
		</code>
	{:else if mark.color}
		<span data-sn-color style="color: {mark.color}">
			{@render children()}
		</span>
	{/if}
{/snippet}

{#snippet children()}
	{#if nextMark}
		<NotionMarks index={index + 1} {content} mark={nextMark} nextMark={marks[index + 2]} {marks} />
	{:else}
		{content}
	{/if}
{/snippet}

{@render (page.snippets.marks || defaultMarks)({ mark, children })}

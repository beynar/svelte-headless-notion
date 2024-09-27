<script lang="ts">
	import type { Mark, Marks as TMarks } from './richtext.js';
	import Marks from './Marks.svelte';
	import type { Snippet } from 'svelte';
	import { getPageContext } from './Page.svelte';

	const {
		mark,
		content,
		index,
		marks,
		nextMark
	}: { marks: TMarks; content: string | Snippet; nextMark?: Mark; index: number; mark: Mark } =
		$props();

	const page = getPageContext();
</script>

{#snippet defaultBold(arg: any)}
	<strong>
		{@render arg.children()}
	</strong>
{/snippet}
{#snippet defaultItalic(arg: any)}
	<em>
		{@render arg.children()}
	</em>
{/snippet}
{#snippet defaultStrikethrough(arg: any)}
	<s>
		{@render arg.children()}
	</s>
{/snippet}
{#snippet defaultUnderline(arg: any)}
	<u>
		{@render arg.children()}
	</u>
{/snippet}
{#snippet defaultInlineCode(arg: any)}
	<u>
		{@render arg.children()}
	</u>
{/snippet}
{#snippet defaultColor(arg: any)}
	<span style="color: var(--notion-{arg.color})">
		{@render arg.children()}
	</span>
{/snippet}

{#snippet children()}
	{#if nextMark}
		<Marks index={index + 1} {content} mark={nextMark} nextMark={marks[index + 2]} {marks} />
	{:else}
		{content}
	{/if}
{/snippet}

{#if mark.bold}
	{@render (page.snippets.bold || defaultBold)({ children })}
{:else if mark.italic}
	{@render (page.snippets.italic || defaultItalic)({ children })}
{:else if mark.strikethrough}
	{@render (page.snippets.strikethrough || defaultStrikethrough)({ children })}
{:else if mark.underline}
	{@render (page.snippets.underline || defaultUnderline)({ children })}
{:else if mark.code}
	{@render (page.snippets.inlineCode || defaultInlineCode)({ children })}
{:else if mark.color}
	{@render (page.snippets.color || defaultColor)({ children, color: mark.color })}
{/if}

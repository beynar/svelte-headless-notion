<script lang="ts">
	import NotionMarks from './Marks.svelte';
	import { getPageContext } from './Page.svelte';
	import type { RichText, Text, Link, Mention } from './richtext.js';
	import { type Snippet } from 'svelte';
	const {
		content
	}: {
		content: RichText;
	} = $props();

	const page = getPageContext();
</script>

{#snippet marks({ textPart }: { textPart: Text | Link | Mention })}
	{#if textPart.marks.length > 0}
		<NotionMarks
			index={0}
			content={textPart.text}
			mark={textPart.marks[0]}
			nextMark={textPart.marks[1]}
			marks={textPart.marks}
		/>
	{:else}
		{textPart.text}
	{/if}
{/snippet}

{#snippet defaultLink({ block, children }: { block: Link; children: Snippet })}
	<a data-sn-link href={block.url}>
		{@render children()}
	</a>
{/snippet}

{#snippet defaultMention({ block, children }: { block: Mention; children: Snippet })}
	<span data-sn-mention>
		@{@render children()}
	</span>
{/snippet}

<span data-sn-text>
	{#each content as textPart}
		{#if textPart.type === 'equation'}
			{textPart.expression}
		{:else if textPart.type === 'text' || textPart.type === 'link' || textPart.type === 'mention'}
			{#snippet children()}
				{@render marks({ textPart })}
			{/snippet}
			{#if textPart.type === 'text'}
				{@render children()}
			{:else if textPart.type === 'link'}
				{@render (page.snippets.link || defaultLink)({ block: textPart, children })}
			{:else if textPart.type === 'mention'}
				{@render (page.snippets.mention || defaultMention)({ block: textPart, children })}
			{/if}
		{/if}
	{/each}
</span>

<script lang="ts">
	import type { Block } from './block.js';
	import Text from './Text.svelte';
	import Blocks from './Blocks.svelte';
	import { getPageContext } from './Page.svelte';

	const { blocks }: { blocks: Block[] } = $props();

	const page = getPageContext();
	const c = (block: Block) => {
		if ('color' in block) {
			const color = block.color;
			if (color?.endsWith('_background')) {
				return `background-color: var(--notion-${color})`;
			} else {
				return `color: var(--notion-${color})`;
			}
		}
		return '';
	};
</script>

{#snippet defaultParagraph(arg: any)}
	<div style={c(arg.block)} data-sn-paragraph>
		<p>
			{@render arg.content()}
		</p>
		{@render arg.children()}
	</div>
{/snippet}

{#snippet defaultHeading1(arg: any)}
	<div style={c(arg.block)} data-sn-heading>
		<h1>{@render arg.content()}</h1>
		{@render arg.children()}
	</div>
{/snippet}

{#snippet defaultHeading2(arg: any)}
	<div style={c(arg.block)} data-sn-heading>
		<h2>{@render arg.content()}</h2>
		{@render arg.children()}
	</div>
{/snippet}
<!--  -->
{#snippet defaultHeading3(arg: any)}
	<div style={c(arg.block)} data-sn-heading>
		<h3>{@render arg.content()}</h3>
		{@render arg.children()}
	</div>
{/snippet}

{#snippet defaultBulletedListItem(arg: any)}
	<div style={c(arg.block)} data-sn-bulleted-list-item>
		<ul>
			<li>
				{@render arg.content()}
				{@render arg.children()}
			</li>
		</ul>
	</div>
{/snippet}

{#snippet defaultNumberedListItem(arg: any)}
	<div style={c(arg.block)} data-sn-numbered-list-item>
		<ol>
			<li>
				{@render arg.content()}
				{@render arg.children()}
			</li>
		</ol>
	</div>
{/snippet}

{#snippet defaultToDo(arg: any)}
	<div style={c(arg.block)} data-sn-todo>
		<label>
			<input type="checkbox" bind:checked={arg.block.checked} />
			{@render arg.content()}
		</label>
		<div>
			{@render arg.children()}
		</div>
	</div>
{/snippet}

{#snippet defaultToggle(arg: any)}
	<details style={c(arg.block)} data-sn-toggle>
		<summary>{@render arg.content()}</summary>
		{@render arg.children()}
	</details>
{/snippet}

{#snippet defaultCode(arg: any)}
	<pre data-sn-code><code>{@render arg.content()}</code></pre>
	<figcaption>{@render arg.caption()}</figcaption>
{/snippet}

{#snippet defaultCallout(arg: any)}
	<div style={c(arg.block)} data-sn-callout>
		<div>{@render arg.content()}</div>
		<div>
			{@render arg.children()}
		</div>
	</div>
{/snippet}

{#snippet defaultQuote(arg: any)}
	<blockquote style={c(arg.block)} data-sn-quote>
		{@render arg.content()}
		<div>
			{@render arg.children()}
		</div>
	</blockquote>
{/snippet}

{#snippet defaultImage(arg: any)}
	<figure data-sn-image>
		<img src={arg.block.url} alt={arg.block.caption} />
		<figcaption>{@render arg.caption()}</figcaption>
	</figure>
{/snippet}

{#snippet defaultDivider()}
	<hr data-sn-divider />
{/snippet}

{#snippet defaultEquation(arg: any)}
	<div data-sn-equation>
		{arg.block.expression}
	</div>
{/snippet}

{#snippet defaultChildPage(arg: any)}
	<div data-sn-child-page>
		<a href={`/${arg.block.id}`}>{arg.block.title}</a>
	</div>
{/snippet}

{#snippet defaultChildDatabase(arg: any)}
	<div data-sn-child-database>
		<a href={`/${arg.block.id}`}>{arg.block.title}</a>
	</div>
{/snippet}

{#snippet defaultEmbed(arg: any)}
	<div data-sn-embed>
		<iframe src={arg.block.url} title="Embedded content" width="100%" height="500"></iframe>
		<figcaption>{@render arg.caption()}</figcaption>
	</div>
{/snippet}

{#snippet defaultVideo(arg: any)}
	<figure data-sn-video>
		<video controls src={arg.block.url}>
			<track kind="captions" />
		</video>
		<figcaption>{@render arg.caption()}</figcaption>
	</figure>
{/snippet}

{#snippet defaultFile(arg: any)}
	<div data-sn-file>
		<a href={arg.block.url} target="_blank" rel="noopener noreferrer">
			{arg.block.name || 'Download file'}
		</a>
		<figcaption>{@render arg.caption()}</figcaption>
	</div>
{/snippet}

{#snippet defaultPdf(arg: any)}
	<div data-sn-pdf>
		<iframe src={arg.block.url} title="PDF document" width="100%" height="500"></iframe>
		<figcaption>{@render arg.caption()}</figcaption>
	</div>
{/snippet}

{#snippet defaultAudio(arg: any)}
	<figure data-sn-audio>
		<audio controls src={arg.block.url}> Your browser does not support the audio element. </audio>
		<figcaption>{@render arg.caption()}</figcaption>
	</figure>
{/snippet}

{#snippet defaultBookmark(arg: any)}
	<div data-sn-bookmark>
		<a href={arg.block.url} target="_blank" rel="noopener noreferrer">
			{arg.block.url}
		</a>
		<figcaption>{@render arg.caption()}</figcaption>
	</div>
{/snippet}

{#snippet defaultTableOfContents(arg: any)}
	<nav data-sn-table-of-contents>
		<p>Table of Contents</p>
	</nav>
{/snippet}

{#snippet defaultBreadcrumb()}
	<nav data-sn-breadcrumb>
		<p>Breadcrumb</p>
	</nav>
{/snippet}

{#snippet defaultColumnList(arg: any)}
	<div
		style:--size={arg.block.children.length}
		data-sn-column-list={arg.block.children.length}
		style="display: grid; gap: 1rem"
	>
		{@render arg.children()}
	</div>
{/snippet}

{#snippet defaultColumn(arg: any)}
	<div data-sn-column>
		{@render arg.children()}
	</div>
{/snippet}

{#snippet defaultLinkPreview(arg: any)}
	<div data-sn-link-preview>
		<a href={arg.block.url} target="_blank" rel="noopener noreferrer">
			{arg.block.url}
		</a>
	</div>
{/snippet}

{#snippet defaultTemplate(arg: any)}
	<div data-sn-template>
		{@render arg.content()}
		{@render arg.children()}
	</div>
{/snippet}

{#snippet defaultLinkToPage(arg: any)}
	<div data-sn-link-to-page>
		<a href={`/${arg.block.id}`}>Link to page</a>
	</div>
{/snippet}

{#snippet defaultSyncedBlock(arg: any)}
	<div data-sn-synced-block>
		{@render arg.children()}
	</div>
{/snippet}

{#snippet defaultTable(arg: any)}
	<table data-sn-table>
		<tbody>
			{@render arg.children()}
		</tbody>
	</table>
{/snippet}

{#snippet defaultTableRow(arg: any)}
	<tr data-sn-table-row>
		{@render arg.children()}
	</tr>
{/snippet}

{#snippet defaultTableCell(arg: any)}
	<svelte:element this={arg.block.isHeader ? 'th' : 'td'} data-sn-table-cell>
		{@render arg.content()}
	</svelte:element>
{/snippet}

{#each blocks as block, i}
	{@const childrenBlocks = 'children' in block ? block.children : undefined}
	{@const contentText = 'content' in block ? block.content : undefined}
	{@const captionText = 'caption' in block ? block.caption : undefined}
	{#snippet content()}
		{#if contentText}
			<Text content={contentText} />
		{/if}
	{/snippet}
	{#snippet children()}
		{#if childrenBlocks}
			<Blocks blocks={childrenBlocks} />
		{/if}
	{/snippet}

	{#snippet caption()}
		{#if captionText}
			<Text content={captionText} />
		{/if}
	{/snippet}

	{#if block.type === 'paragraph'}
		{@render (page?.snippets?.paragraph || defaultParagraph)({ block, content, children })}
	{:else if block.type === 'heading_1'}
		{@render (page?.snippets?.heading_1 || defaultHeading1)({ block, content, children })}
	{:else if block.type === 'heading_2'}
		{@render (page?.snippets?.heading_2 || defaultHeading2)({ block, content, children })}
	{:else if block.type === 'heading_3'}
		{@render (page?.snippets?.heading_3 || defaultHeading3)({ block, content, children })}
	{:else if block.type === 'bulleted_list_item'}
		{@render (page?.snippets?.bulleted_list_item || defaultBulletedListItem)({
			block,
			content,
			children
		})}
	{:else if block.type === 'numbered_list_item'}
		{@render (page?.snippets?.numbered_list_item || defaultNumberedListItem)({
			block,
			content,
			children
		})}
	{:else if block.type === 'to_do'}
		{@render (page?.snippets?.to_do || defaultToDo)({ block, content, children })}
	{:else if block.type === 'toggle'}
		{@render (page?.snippets?.toggle || defaultToggle)({ block, content, children })}
	{:else if block.type === 'code'}
		{@render (page?.snippets?.code || defaultCode)({ block, content, children, caption })}
	{:else if block.type === 'callout'}
		{@render (page?.snippets?.callout || defaultCallout)({ block, content, children })}
	{:else if block.type === 'quote'}
		{@render (page?.snippets?.quote || defaultQuote)({ block, content, children })}
	{:else if block.type === 'image'}
		{@render (page?.snippets?.image || defaultImage)({ block, caption })}
	{:else if block.type === 'divider'}
		{@render (page?.snippets?.divider || defaultDivider)({ block })}
	{:else if block.type === 'equation'}
		{@render (page?.snippets?.equation || defaultEquation)({ block })}
	{:else if block.type === 'child_page'}
		{@render (page?.snippets?.child_page || defaultChildPage)({ block })}
	{:else if block.type === 'child_database'}
		{@render (page?.snippets?.child_database || defaultChildDatabase)({ block })}
	{:else if block.type === 'embed'}
		{@render (page?.snippets?.embed || defaultEmbed)({ block, caption })}
	{:else if block.type === 'video'}
		{@render (page?.snippets?.video || defaultVideo)({ block, caption })}
	{:else if block.type === 'file'}
		{@render (page?.snippets?.file || defaultFile)({ block, caption })}
	{:else if block.type === 'pdf'}
		{@render (page?.snippets?.pdf || defaultPdf)({ block, caption })}
	{:else if block.type === 'bookmark'}
		{@render (page?.snippets?.bookmark || defaultBookmark)({ block, caption })}
	{:else if block.type === 'table_of_contents'}
		{@render (page?.snippets?.table_of_contents || defaultTableOfContents)({ block })}
	{:else if block.type === 'breadcrumb'}
		{@render (page?.snippets?.breadcrumb || defaultBreadcrumb)({ block })}
	{:else if block.type === 'column_list'}
		{@render (page?.snippets?.column_list || defaultColumnList)({ block, children })}
	{:else if block.type === 'column'}
		{@render (page?.snippets?.column || defaultColumn)({ block, children })}
	{:else if block.type === 'synced_block'}
		{@render (page?.snippets?.synced_block || defaultSyncedBlock)({ block, children })}
	{:else if block.type === 'template'}
		{@render (page?.snippets?.template || defaultTemplate)({ block, content, children })}
	{:else if block.type === 'link_to_page'}
		{@render (page?.snippets?.link_to_page || defaultLinkToPage)({ block })}
	{:else if block.type === 'table'}
		{@render (page?.snippets?.table || defaultTable)({ block, children })}
	{:else if block.type === 'table_row'}
		{@render (page?.snippets?.table_row || defaultTableRow)({ block, children })}
	{:else if block.type === 'link_preview'}
		{@render (page?.snippets?.link_preview || defaultLinkPreview)({ block })}
	{:else if block.type === 'audio'}
		{@render (page?.snippets?.audio || defaultAudio)({ block, caption })}
	{:else if block.type === 'table_cell'}
		{@render (page?.snippets?.table_cell || defaultTableCell)({ block, content })}
	{:else}
		<!-- UNSUPPORTED BLOCK -->
	{/if}
{/each}

<style>
	[data-sn-column-list] {
		grid-template-columns: repeat(var(--size), minmax(0, 1fr));
	}
	@media (max-width: 768px) {
		[data-sn-column-list] {
			grid-template-columns: repeat(round(down, calc(var(--size) / 2)), minmax(0, 1fr));
		}
	}

	@media (max-width: 480px) {
		[data-sn-column-list] {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
	}
</style>

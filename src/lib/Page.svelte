<script lang="ts" module>
	import { getContext, setContext, type Snippet } from 'svelte';
	import type { PageWithBlocks } from './server.js';
	import type { Colors, Link, Mark, Mention } from './richtext.js';
	import type { Property, Properties, PageWithProperties } from './properties.js';
	import {
		type BulletedListItemBlock,
		type HeadingBlock,
		type ParagraphBlock,
		type NumberedListItemBlock,
		type ToDoBlock,
		type ToggleBlock,
		type CalloutBlock,
		type QuoteBlock,
		type CodeBlock,
		type EmbedBlock,
		type ImageBlock,
		type VideoBlock,
		type FileBlock,
		type PdfBlock,
		type AudioBlock,
		type BookmarkBlock,
		type ChildDatabaseBlock,
		type EquationBlock,
		type DividerBlock,
		type LinkPreviewBlock,
		type TableBlock,
		type TableRowBlock,
		type TableCellBlock,
		type TableOfContentsBlock,
		type BreadcrumbBlock,
		type ColumnListBlock,
		type ColumnBlock,
		type SyncedBlock,
		type TemplateBlock,
		type LinkToPageBlock,
		type UnsupportedBlock,
		type ChildPageBlock,
		type Block
	} from './block.js';
	type OmitNever<T> = Pick<
		T,
		{
			[K in keyof T]: T[K] extends never ? never : K;
		}[keyof T]
	>;
	export type BlockSnippet<
		T extends Block,
		CHILDREN extends boolean = false,
		CONTENT extends boolean = false,
		CAPTION extends boolean = false
	> = Snippet<
		[
			OmitNever<{
				block: T;
				caption: CAPTION extends true ? Snippet : never;
				content: CONTENT extends true ? Snippet : never;
				children: CHILDREN extends true ? Snippet : never;
			}>
		]
	>;

	export type PageSnippets = Partial<{
		paragraph: BlockSnippet<ParagraphBlock, true, true>;
		heading: BlockSnippet<HeadingBlock, true, true>;
		bulleted_list_item: BlockSnippet<BulletedListItemBlock, true, true>;
		numbered_list_item: BlockSnippet<NumberedListItemBlock, true, true>;
		to_do: BlockSnippet<ToDoBlock, true, true>;
		toggle: BlockSnippet<ToggleBlock, true, true>;
		callout: BlockSnippet<CalloutBlock, true, true>;
		quote: BlockSnippet<QuoteBlock, true, true>;
		code: BlockSnippet<CodeBlock, true, true, true>;
		embed: BlockSnippet<EmbedBlock, false, false, true>;
		image: BlockSnippet<ImageBlock, false, false, true>;
		video: BlockSnippet<VideoBlock, false, false, true>;
		file: BlockSnippet<FileBlock, false, false, true>;
		pdf: BlockSnippet<PdfBlock, false, false, true>;
		audio: BlockSnippet<AudioBlock, false, false, true>;
		bookmark: BlockSnippet<BookmarkBlock, false, false, true>;
		child_page: BlockSnippet<ChildPageBlock>;
		child_database: BlockSnippet<ChildDatabaseBlock>;
		equation: BlockSnippet<EquationBlock, false, false, false>;
		divider: BlockSnippet<DividerBlock>;
		table: BlockSnippet<TableBlock, true>;
		table_row: BlockSnippet<TableRowBlock, true>;
		table_cell: BlockSnippet<TableCellBlock, false, true>;
		table_of_contents: BlockSnippet<TableOfContentsBlock>;
		breadcrumb: BlockSnippet<BreadcrumbBlock>;
		column_list: BlockSnippet<ColumnListBlock, true>;
		column: BlockSnippet<ColumnBlock, true>;
		synced_block: BlockSnippet<SyncedBlock, true>;
		template: BlockSnippet<TemplateBlock, true, true>;
		link_preview: BlockSnippet<LinkPreviewBlock>;
		link_to_page: BlockSnippet<LinkToPageBlock>;
		unsupported: BlockSnippet<UnsupportedBlock>;
		link: Snippet<[{ block: Link; children: Snippet }]>;
		mention: Snippet<[{ block: Mention; children: Snippet }]>;
		marks: Snippet<[{ mark: Mark; children: Snippet }]>;
		bold: Snippet<[{ children: Snippet }]>;
		italic: Snippet<[{ children: Snippet }]>;
		strikethrough: Snippet<[{ children: Snippet }]>;
		underline: Snippet<[{ children: Snippet }]>;
		inlineCode: Snippet<[{ children: Snippet }]>;
		color: Snippet<[{ children: Snippet; color: Colors }]>;
	}>;

	export type PageContext = {
		page: PageWithBlocks;
		snippets: PageSnippets;
	};

	export type {
		Colors,
		BulletedListItemBlock,
		HeadingBlock,
		ParagraphBlock,
		NumberedListItemBlock,
		ToDoBlock,
		ToggleBlock,
		CalloutBlock,
		QuoteBlock,
		CodeBlock,
		EmbedBlock,
		ImageBlock,
		VideoBlock,
		FileBlock,
		PdfBlock,
		AudioBlock,
		BookmarkBlock,
		ChildDatabaseBlock,
		EquationBlock,
		DividerBlock,
		LinkPreviewBlock,
		TableBlock,
		TableRowBlock,
		TableCellBlock,
		TableOfContentsBlock,
		BreadcrumbBlock,
		ColumnListBlock,
		ColumnBlock,
		SyncedBlock,
		TemplateBlock,
		LinkToPageBlock,
		UnsupportedBlock,
		ChildPageBlock,
		Block,
		Link,
		Mark,
		Mention,
		Property,
		Properties,
		PageWithProperties
	};

	export const registerPage = (context: PageContext) => {
		setContext('page', context);
	};

	export const getPageContext = () => {
		return getContext<PageContext>('page');
	};
</script>

<script lang="ts">
	import Blocks from './Blocks.svelte';
	import Text from './Text.svelte';

	const {
		as = 'article',
		class: className = '',
		header,
		footer,
		page,
		...snippets
	}: {
		class?: string;
		as?: string;
		header?: Snippet<[{ page: PageWithBlocks }]>;
		footer?: Snippet<[{ page: PageWithBlocks }]>;
		page: PageWithBlocks;
	} & PageSnippets = $props();

	registerPage({ page, snippets });
</script>

<svelte:element this={as} data-sn-page class={className}>
	{#if header}
		{@render header({ page })}
	{:else}
		<img src={page.cover} alt="" style="width: 100%; height: 300px; object-fit: cover;" />
		<h1 data-sn-page-title>
			<Text content={page.title} />
		</h1>
	{/if}
	<Blocks blocks={page.blocks} />
	{#if footer}
		{@render footer({ page })}
	{/if}
</svelte:element>

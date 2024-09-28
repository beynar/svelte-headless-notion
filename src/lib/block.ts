import type {
	BlockObjectResponse,
	ChildDatabaseBlockObjectResponse,
	ChildPageBlockObjectResponse,
	CodeBlockObjectResponse,
	LinkToPageBlockObjectResponse,
	TableBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints.js';
import { sanitizeRichText, type RichText } from './richtext.js';
import type { PageWithProperties } from './properties.js';
export type Color =
	| 'default'
	| 'gray'
	| 'brown'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'blue'
	| 'purple'
	| 'pink'
	| 'red'
	| 'gray_background'
	| 'brown_background'
	| 'orange_background'
	| 'yellow_background'
	| 'green_background'
	| 'blue_background'
	| 'purple_background'
	| 'pink_background'
	| 'red_background';

export type TextualBlock = {
	color?: Color;
	content: RichText;
	children: Block[];
};

export type ParagraphBlock = TextualBlock & {
	type: 'paragraph';
};

export type HeadingBlock = Omit<TextualBlock, 'children'> & {
	type: 'heading_1' | 'heading_2' | 'heading_3';
	toggleable?: boolean;
	isOpen?: boolean;
};

export type BulletedListItemBlock = TextualBlock & {
	type: 'bulleted_list_item';
};

export type NumberedListItemBlock = TextualBlock & {
	type: 'numbered_list_item';
};

export type ToDoBlock = TextualBlock & {
	type: 'to_do';
	checked?: boolean;
};

export type ToggleBlock = TextualBlock & {
	type: 'toggle';
	isOpen?: boolean;
};

export type CalloutBlock = TextualBlock & {
	type: 'callout';
	// icon?: EmojiObject | FileObject;
	icon?: any;
};

export type QuoteBlock = TextualBlock & {
	type: 'quote';
};

export type CodeLanguage = CodeBlockObjectResponse['code']['language'];
export type CodeBlock = Omit<TextualBlock, 'color'> & {
	type: 'code';
	language?: CodeLanguage;
	caption: RichText;
};

export type MediaBlock = {
	url: string;
	caption: RichText;
};

export type EmbedBlock = MediaBlock & {
	type: 'embed';
};
export type ImageBlock = MediaBlock & {
	type: 'image';
};

export type VideoBlock = MediaBlock & {
	type: 'video';
};

export type FileBlock = MediaBlock & {
	type: 'file';
};
export type PdfBlock = MediaBlock & {
	type: 'pdf';
};
export type AudioBlock = MediaBlock & {
	type: 'audio';
};

export type BookmarkBlock = MediaBlock & {
	type: 'bookmark';
};

export type EquationBlock = {
	type: 'equation';
	expression: string;
};

export type DividerBlock = {
	type: 'divider';
};

export type TableOfContentsBlock = {
	type: 'table_of_contents';
	color?: string;
};

export type BreadcrumbBlock = {
	type: 'breadcrumb';
};

export type ColumnListBlock = {
	type: 'column_list';
	children: Block[];
};
export type ColumnBlock = {
	type: 'column';
	children: Block[];
};

export type SyncedBlock = {
	type: 'synced_block';
	synced_from?: string;
	children?: Block[];
};

export type TemplateBlock = {
	type: 'template';
	content: RichText;
	children?: Block[];
};

export type LinkToPageBlock = {
	type: 'link_to_page';
	linkType: 'page_id' | 'database_id' | 'comment_id';
	page?: PageWithProperties;
};

export type TableBlock = {
	type: 'table';
	table_width: number;
	has_column_header: boolean;
	has_row_header: boolean;
	children: Block[];
};

export type TableRowBlock = {
	type: 'table_row';
	children: Block[];
};

export type TableCellBlock = {
	type: 'table_cell';
	rowSpan: number;
	isHeader: boolean;
	colSpan: number;
	content: RichText;
};

export type LinkPreviewBlock = {
	type: 'link_preview';
	url: string;
};
export type UnsupportedBlock = {
	type: 'unsupported';
};

export type ChildPageBlock = {
	type: 'child_page';
	page: PageWithProperties;
};
export type ChildDatabaseBlock = {
	type: 'child_database';
	title?: string;
	pages: PageWithProperties[];
};

export type Block =
	| UnsupportedBlock
	| ParagraphBlock
	| HeadingBlock
	| BulletedListItemBlock
	| NumberedListItemBlock
	| ToDoBlock
	| ToggleBlock
	| CodeBlock
	| CalloutBlock
	| QuoteBlock
	| ChildPageBlock
	| ChildDatabaseBlock
	| EmbedBlock
	| ImageBlock
	| VideoBlock
	| FileBlock
	| PdfBlock
	| BookmarkBlock
	| EquationBlock
	| DividerBlock
	| LinkPreviewBlock
	| TableBlock
	| TableRowBlock
	| TableCellBlock
	| TableOfContentsBlock
	| BreadcrumbBlock
	| ColumnListBlock
	| ColumnBlock
	| SyncedBlock
	| TemplateBlock
	| LinkToPageBlock
	| LinkPreviewBlock
	| AudioBlock;

export type RawBlock =
	| (Exclude<
			BlockObjectResponse,
			| ChildPageBlockObjectResponse
			| ChildDatabaseBlockObjectResponse
			| LinkToPageBlockObjectResponse
	  > & { children: RawBlock[] })
	| (ChildPageBlockObjectResponse & { page: PageWithProperties })
	| (ChildDatabaseBlockObjectResponse & { pages: PageWithProperties[] })
	| (LinkToPageBlockObjectResponse & { page?: PageWithProperties });

const removeColor = (block: Block) => {
	if ('color' in block && block.color === 'default') {
		delete block.color;
	}
	return block;
};

const extractBlock = (block: RawBlock, parent?: RawBlock, blockIndex?: number): Block => {
	switch (block.type) {
		default: {
			return {
				type: 'unsupported'
			};
		}

		case 'paragraph': {
			return {
				type: 'paragraph',
				content: sanitizeRichText(block.paragraph.rich_text),
				children: sanitizeBlocks(block.children, block),
				color: block.paragraph.color
			} satisfies ParagraphBlock;
		}

		case 'heading_1': {
			return {
				type: 'heading_1',

				content: sanitizeRichText(block.heading_1.rich_text),
				toggleable: block.heading_1.is_toggleable,
				isOpen: false,
				color: block.heading_1.color
			} satisfies HeadingBlock;
		}

		case 'heading_2': {
			return {
				type: 'heading_2',
				content: sanitizeRichText(block.heading_2.rich_text),
				toggleable: block.heading_2.is_toggleable,
				isOpen: false,
				color: block.heading_2.color
			} satisfies HeadingBlock;
		}
		case 'heading_3': {
			return {
				type: 'heading_3',

				content: sanitizeRichText(block.heading_3.rich_text),
				toggleable: block.heading_3.is_toggleable,
				isOpen: false,
				color: block.heading_3.color
			} satisfies HeadingBlock;
		}

		case 'bulleted_list_item': {
			return {
				type: 'bulleted_list_item',
				content: sanitizeRichText(block.bulleted_list_item.rich_text),
				color: block.bulleted_list_item.color,
				children: sanitizeBlocks(block.children)
			} satisfies BulletedListItemBlock;
		}
		case 'numbered_list_item': {
			return {
				type: 'numbered_list_item',
				content: sanitizeRichText(block.numbered_list_item.rich_text),
				color: block.numbered_list_item.color,
				children: sanitizeBlocks(block.children)
			} satisfies NumberedListItemBlock;
		}
		case 'to_do': {
			return {
				type: 'to_do',
				content: sanitizeRichText(block.to_do.rich_text),
				color: block.to_do.color,
				checked: block.to_do.checked,
				children: sanitizeBlocks(block.children)
			} satisfies ToDoBlock;
		}
		case 'toggle': {
			return {
				type: 'toggle',
				content: sanitizeRichText(block.toggle.rich_text),
				color: block.toggle.color,
				isOpen: false,
				children: sanitizeBlocks(block.children)
			} satisfies ToggleBlock;
		}
		case 'column': {
			return {
				type: 'column',
				children: sanitizeBlocks(block.children)
			} satisfies ColumnBlock;
		}
		case 'column_list': {
			return {
				type: 'column_list',
				children: sanitizeBlocks(block.children)
			} satisfies ColumnListBlock;
		}
		case 'code': {
			return {
				type: 'code',
				language: block.code.language,
				content: sanitizeRichText(block.code.rich_text),
				caption: sanitizeRichText(block.code.caption),
				children: sanitizeBlocks(block.children)
			} satisfies CodeBlock;
		}
		case 'callout': {
			return {
				type: 'callout',
				content: sanitizeRichText(block.callout.rich_text),
				color: block.callout.color,
				icon: block.callout.icon,
				children: sanitizeBlocks(block.children)
			} satisfies CalloutBlock;
		}
		case 'quote': {
			return {
				type: 'quote',
				content: sanitizeRichText(block.quote.rich_text),
				color: block.quote.color,
				children: sanitizeBlocks(block.children)
			} satisfies QuoteBlock;
		}
		case 'bookmark': {
			return {
				type: 'bookmark',
				url: block.bookmark.url,
				caption: sanitizeRichText(block.bookmark.caption)
			} satisfies BookmarkBlock;
		}
		case 'pdf': {
			return {
				type: 'pdf',
				url: block.pdf.type === 'file' ? block.pdf.file.url : block.pdf.external.url,
				caption: sanitizeRichText(block.pdf.caption)
			} satisfies PdfBlock;
		}
		case 'breadcrumb': {
			return {
				type: 'breadcrumb'
			} satisfies BreadcrumbBlock;
		}
		case 'divider': {
			return {
				type: 'divider'
			} satisfies DividerBlock;
		}
		case 'embed': {
			return {
				type: 'embed',
				url: block.embed.url,
				caption: sanitizeRichText(block.embed.caption)
			} satisfies EmbedBlock;
		}
		case 'audio': {
			return {
				type: 'unsupported'
			} satisfies UnsupportedBlock;
		}
		case 'equation': {
			return {
				type: 'equation',
				expression: block.equation.expression
			} satisfies EquationBlock;
		}
		case 'file': {
			return {
				type: 'file',
				url: block.file.type === 'file' ? block.file.file.url : block.file.external.url,
				caption: sanitizeRichText(block.file.caption)
			} satisfies FileBlock;
		}
		case 'video': {
			return {
				type: 'video',
				url: block.video.type === 'file' ? block.video.file.url : block.video.external.url,
				caption: sanitizeRichText(block.video.caption)
			} satisfies VideoBlock;
		}
		case 'image': {
			return {
				type: 'image',
				url: block.image.type === 'file' ? block.image.file.url : block.image.external.url,
				caption: sanitizeRichText(block.image.caption)
			} satisfies ImageBlock;
		}
		case 'synced_block': {
			return {
				type: 'synced_block',
				synced_from: block.synced_block.synced_from?.block_id,
				children: sanitizeBlocks(block.children)
			} satisfies SyncedBlock;
		}
		case 'template': {
			return {
				type: 'template',
				content: sanitizeRichText(block.template.rich_text),
				children: sanitizeBlocks(block.children)
			} satisfies TemplateBlock;
		}
		case 'link_preview': {
			return {
				type: 'link_preview',
				url: block.link_preview.url
			} satisfies LinkPreviewBlock;
		}
		case 'table': {
			return {
				type: 'table',
				table_width: block.table.table_width,
				has_column_header: block.table.has_column_header,
				has_row_header: block.table.has_row_header,
				children: sanitizeBlocks(block.children, block)
			} satisfies TableBlock;
		}
		case 'table_row': {
			const parentTable = parent as TableBlockObjectResponse;
			const hasColumnHeader = parentTable?.table?.has_column_header;
			const hasRowHeader = parentTable?.table?.has_row_header;
			return {
				type: 'table_row',
				children: block.table_row.cells.map((cells, index) => {
					return {
						type: 'table_cell',
						isHeader: (blockIndex === 0 && hasColumnHeader) || (hasRowHeader && index === 0),
						content: sanitizeRichText(cells),
						rowSpan: 1,
						colSpan: 1
					} satisfies TableCellBlock;
				})
			} satisfies TableRowBlock;
		}
		case 'table_of_contents': {
			return {
				type: 'table_of_contents',
				color: block.table_of_contents.color
			} satisfies TableOfContentsBlock;
		}
		case 'link_to_page': {
			return {
				type: 'link_to_page',
				linkType: block.link_to_page.type,
				page: block.page
			} satisfies LinkToPageBlock;
		}
		case 'child_database': {
			return {
				type: 'child_database',
				title: block.child_database.title,
				pages: block.pages
			} satisfies ChildDatabaseBlock;
		}
		case 'child_page': {
			return {
				type: 'child_page',
				page: block.page
			} satisfies ChildPageBlock;
		}
		case 'unsupported': {
			return {
				type: 'unsupported'
			} satisfies UnsupportedBlock;
		}
	}
};

export const sanitizeBlocks = (children: RawBlock[] = [], parent?: RawBlock) =>
	children.reduce((acc: Block[], block: RawBlock, index: number, array: RawBlock[]): Block[] => {
		const sanitizedBlock = removeColor(extractBlock(block, parent, index));
		// remove trailing paragraph
		if (
			sanitizedBlock.type === 'paragraph' &&
			sanitizedBlock.content?.length === 0 &&
			sanitizedBlock.children?.length === 0 &&
			index === array.length - 1
		) {
			let previousIndex = index - 1;
			let previousBlock = acc[index - 1];
			while (
				previousBlock.type === 'paragraph' &&
				previousBlock.content?.length === 0 &&
				previousBlock.children?.length === 0
			) {
				previousIndex -= 1;
				previousBlock = acc[previousIndex];
				acc.pop();
			}
			return acc;
		}
		acc.push(sanitizedBlock);
		return acc;
	}, [] as Block[]);

import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints.js';
type Colors =
	| 'blue'
	| 'blue_background'
	| 'brown'
	| 'brown_background'
	| 'default'
	| 'gray'
	| 'gray_background'
	| 'green'
	| 'green_background'
	| 'orange'
	| 'orange_background'
	| 'pink'
	| 'pink_background'
	| 'purple'
	| 'purple_background'
	| 'red'
	| 'red_background'
	| 'yellow'
	| 'yellow_background';

export type Mark = {
	bold?: true;
	italic?: true;
	strikethrough?: true;
	underline?: true;
	code?: true;
	color?: Colors;
};

export type Marks = Mark[];
export type Text = {
	type: 'text';
	text: string;
	marks: Marks;
};

export type Equation = {
	type: 'equation';
	expression: string;
	marks: Marks;
};

export type Mention = {
	type: 'mention';
	text: string;
	mention: {
		type: 'database' | 'date' | 'link_preview' | 'page' | 'template_mention' | 'user';
		id?: string | null;
		start?: string | null;
		end?: string | null;
		url?: string | null;
	};
	marks: Marks;
};

export type Link = {
	type: 'link';
	text: string;
	url: string;
	marks: Marks;
};

export type RichText = (Text | Equation | Mention | Link)[];

export const sanitizeRichText = (richtext: RichTextItemResponse[]): RichText => {
	return richtext.map((item) => {
		const annotations = {
			bold: item.annotations.bold,
			italic: item.annotations.italic,
			strikethrough: item.annotations.strikethrough,
			underline: item.annotations.underline,
			code: item.annotations.code,
			color: item.annotations.color
		};
		const marks = Object.entries(annotations).reduce((acc, [key, value]) => {
			if (value && value !== 'default') {
				acc.push({ [key]: value } as Mark);
			}
			return acc;
		}, [] as Marks);

		if (item.href) {
			return {
				type: 'link',
				text: item.plain_text,
				url: item.href,
				marks
			} satisfies Link;
		}
		if (item.type === 'equation') {
			return {
				type: 'equation',
				expression: item.equation.expression,
				marks
			} satisfies Equation;
		}

		if (item.type === 'mention') {
			return {
				type: 'mention',
				text: item.plain_text,
				mention: {
					type: item.mention.type,
					// @ts-ignore
					id: item.mention.user?.id || item.mention.database?.id || item.mention.page?.id,
					// @ts-ignore
					start: item.mention.date?.start,
					// @ts-ignore
					end: item.mention.date.end,
					// @ts-ignore
					url: item.mention.url
				},
				marks
			} satisfies Mention;
		}

		return {
			type: 'text',
			text: item.plain_text,
			marks
		} satisfies Text;
	});
};

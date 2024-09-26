import type {
	FormulaPropertyItemObjectResponse,
	PageObjectResponse
} from '@notionhq/client/build/src/api-endpoints.js';
import { sanitizeRichText, type RichText } from './richtext.js';
import type { Notion } from './server.js';

type BaseProperty<T extends string, P extends Record<string, any>> = {
	type: T;
	title: string;
} & P;

type Checkbox = BaseProperty<
	'checkbox',
	{
		checked: boolean;
	}
>;

type User = {
	id: string;
	name: string | null;
	avatar_url: string | null;
	type: 'person' | 'bot';
};

type CreatedBy = BaseProperty<
	'created_by',
	{
		user: User;
	}
>;

type Title = BaseProperty<
	'title',
	{
		content: RichText;
	}
>;

type RichTextProperty = BaseProperty<
	'rich_text',
	{
		content: RichText;
	}
>;

type Number = BaseProperty<
	'number',
	{
		value: number | null;
	}
>;

type Select = BaseProperty<
	'select',
	{
		value: {
			id: string;
			name: string;
			color: string;
		} | null;
	}
>;

type MultiSelect = BaseProperty<
	'multi_select',
	{
		value: Array<{
			id: string;
			name: string;
			color: string;
		}>;
	}
>;

type Date = BaseProperty<
	'date',
	{
		start?: string;
		end?: string | null;
		time_zone?: string | null;
	}
>;

type People = BaseProperty<
	'people',
	{
		peoples: Array<{
			id: string;
			// name: string;
			// avatar_url: string | null;
			// type: 'person' | 'bot';
			// person?: {
			// 	email: string;
			// };
		}>;
	}
>;

type Files = BaseProperty<
	'files',
	{
		files: Array<{
			name: string;

			url: string;
		}>;
	}
>;

type Url = BaseProperty<
	'url',
	{
		url: string | null;
	}
>;

type Email = BaseProperty<
	'email',
	{
		email: string | null;
	}
>;

type PhoneNumber = BaseProperty<
	'phone_number',
	{
		phone: string | null;
	}
>;

type Formula = BaseProperty<
	'formula',
	{
		formula: FormulaPropertyItemObjectResponse['formula'];
	}
>;

type Relation = BaseProperty<
	'relation',
	{
		relation: Array<{
			id: string;
		}>;
	}
>;

type Rollup = BaseProperty<
	'rollup',
	{
		rollup: any;
	}
>;

type CreatedTime = BaseProperty<
	'created_time',
	{
		date: string;
	}
>;

type LastEditedTime = BaseProperty<
	'last_edited_time',
	{
		date: string;
	}
>;

type LastEditedBy = BaseProperty<
	'last_edited_by',
	{
		user: User;
	}
>;

type Unknown = BaseProperty<'unknown', {}>;

type NotionProperty =
	| Title
	| RichTextProperty
	| Number
	| Select
	| MultiSelect
	| Date
	| People
	| Files
	| Checkbox
	| Url
	| Email
	| PhoneNumber
	| Formula
	| Relation
	| Rollup
	| CreatedTime
	| CreatedBy
	| LastEditedTime
	| LastEditedBy
	| Unknown;

export type NotionProperties = NotionProperty[];
export type PageWithProperties = {
	title: RichText;
	cover?: string;
	icon?: {
		type?: string;
		value?: string;
	};
	created_time: string;
	last_edited_time: string;
	parent: string;
	properties: NotionProperties;
};

export const sanitizePageProperties = async (
	page: PageObjectResponse,
	notion: Notion
): Promise<PageWithProperties> => {
	const entries = Object.entries(page.properties);
	const properties = await Promise.all(
		entries.map(async ([key, value]): Promise<NotionProperty> => {
			switch (value.type) {
				default:
					return {
						type: 'unknown',
						title: key
					};
				case 'title':
					return {
						type: 'title',
						content: sanitizeRichText(value.title),
						title: key
					};

				case 'rich_text':
					return {
						type: 'rich_text',
						content: sanitizeRichText(value.rich_text),
						title: key
					};

				case 'number':
					return {
						type: 'number',
						value: value.number,
						title: key
					};

				case 'select':
					return {
						type: 'select',
						value: value.select,
						title: key
					};

				case 'multi_select':
					return {
						type: 'multi_select',
						value: value.multi_select,
						title: key
					};

				case 'date':
					return {
						type: 'date',
						start: value.date?.start,
						end: value.date?.end,
						time_zone: value.date?.time_zone,
						title: key
					};

				case 'people':
					return {
						type: 'people',
						peoples: value.people.map((person) => ({
							id: person.id
							// name: person.,
							// avatar_url: person.avatar_url,
							// type: person.type,
							// person: person.person
						})),
						title: key
					};

				case 'files':
					return {
						type: 'files',
						files: value.files.map((file) => ({
							name: file.name,
							type: file.type,
							// @ts-ignore
							url: file.type === 'external' ? file.external.url : file.file.url
						})),
						title: key
					};

				case 'checkbox':
					return {
						type: 'checkbox',
						checked: value.checkbox,
						title: key
					};

				case 'url':
					return {
						type: 'url',
						url: value.url,
						title: key
					};

				case 'email':
					return {
						type: 'email',
						email: value.email,
						title: key
					};

				case 'phone_number':
					return {
						type: 'phone_number',
						phone: value.phone_number,
						title: key
					};

				case 'formula':
					return {
						type: 'formula',
						formula: value.formula,
						title: key
					};

				case 'relation':
					return {
						type: 'relation',
						relation: value.relation,
						title: key
					};

				case 'rollup':
					return {
						type: 'rollup',
						rollup: value.rollup,
						title: key
					};

				case 'created_time':
					return {
						type: 'created_time',
						date: value.created_time,
						title: key
					};

				case 'created_by': {
					const user = await notion.getUser(value.created_by.id);
					return {
						type: 'created_by',
						user: {
							id: user.id,
							name: user.name,
							avatar_url: user.avatar_url,
							type: user.type
						},
						title: key
					};
				}

				case 'last_edited_time':
					return {
						type: 'last_edited_time',
						date: value.last_edited_time,
						title: key
					};

				case 'last_edited_by':
					const user = await notion.getUser(value.id);
					return {
						type: 'last_edited_by',
						user: {
							id: user.id,
							name: user.name,
							avatar_url: user.avatar_url,
							type: user.type
						},
						title: key
					};
			}
		})
	);

	return {
		title: properties.find((property) => property.type === 'title')!.content,
		cover: page.cover?.type === 'external' ? page.cover.external.url : page.cover?.file.url,
		icon: {
			type: page.icon?.type,
			value:
				page.icon?.type === 'emoji'
					? page.icon.emoji
					: page.icon?.type === 'external'
						? page.icon.external.url
						: page.icon?.file.url
		},
		created_time: page.created_time,
		last_edited_time: page.last_edited_time,
		// @ts-ignore
		parent: page.parent.page_id || page.parent.database_id || page.parent.block_id || 'workspace',
		properties
	};
};

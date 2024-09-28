import type {
	DatabaseObjectResponse,
	FormulaPropertyItemObjectResponse,
	GetDatabaseResponse,
	PageObjectResponse,
	UserObjectResponse
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

type DateProperty = BaseProperty<
	'date',
	{
		start: Date | null;
		end: Date | null;
		time_zone?: string | null;
	}
>;

type People = BaseProperty<
	'people',
	{
		peoples: User[];
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
		date: Date;
	}
>;

type LastEditedTime = BaseProperty<
	'last_edited_time',
	{
		date: Date;
	}
>;

type LastEditedBy = BaseProperty<
	'last_edited_by',
	{
		user: User;
	}
>;

type Unknown = BaseProperty<'unknown', {}>;

export type Property =
	| Title
	| RichTextProperty
	| Number
	| Select
	| MultiSelect
	| DateProperty
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

export type Properties = Property[];
export type PageWithProperties = {
	id: string;
	title: RichText;
	createdBy: User;
	lastEditedBy: User;
	cover?: string;
	icon?: {
		type?: string;
		value?: string;
	};
	created_time: Date;
	last_edited_time: Date;
	parent: string;
	properties: Map<string, Property>;
};

const sanitizeUser = (user: User) => {
	return {
		id: user.id,
		name: user.name,
		avatar_url: user.avatar_url,
		type: user.type
	};
};

export const sanitizePageProperties = async (
	page: PageObjectResponse,
	notion: Notion
): Promise<PageWithProperties> => {
	const entries = Object.entries(page.properties);
	const [createdBy, lastEditedBy] = await Promise.all([
		notion.getUser(page.created_by.id),
		notion.getUser(page.last_edited_by.id)
	]);
	const properties = await Promise.all(
		entries.map(async ([key, value]): Promise<Property> => {
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
						start: new Date(value.date?.start || '') || null,
						end: new Date(value.date?.end || '') || null,
						time_zone: value.date?.time_zone,
						title: key
					};

				case 'people': {
					const users = await Promise.all(value.people.map((person) => notion.getUser(person.id)));
					return {
						type: 'people',
						peoples: users.map(sanitizeUser),
						title: key
					};
				}

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
						date: new Date(value.created_time),
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
						date: new Date(value.last_edited_time),
						title: key
					};

				case 'last_edited_by':
					const user = await notion.getUser(value.id);
					return {
						type: 'last_edited_by',
						user: sanitizeUser(user),
						title: key
					};
			}
		})
	);

	return {
		id: page.id,
		createdBy: sanitizeUser(createdBy),
		lastEditedBy: sanitizeUser(lastEditedBy),
		title: properties.find((property) => property.type === 'title')!.content,
		cover: page.cover?.type === 'external' ? page.cover.external.url : page.cover?.file.url,
		icon: page.icon?.type
			? {
					type: page.icon?.type,
					value:
						page.icon?.type === 'emoji'
							? page.icon.emoji
							: page.icon?.type === 'external'
								? page.icon.external.url
								: page.icon?.file.url
				}
			: undefined,
		created_time: new Date(page.created_time),
		last_edited_time: new Date(page.last_edited_time),
		// @ts-ignore
		parent: page.parent.page_id || page.parent.database_id || page.parent.block_id || 'workspace',
		properties: new Map(
			properties.filter((p) => p.title !== 'title').map((property) => [property.title, property])
		)
	};
};

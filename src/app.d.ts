// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			caches: {
				default: import('@cloudflare/workers-types').Cache;
			};
			env: {
				SVELTE_NOTION: import('@cloudflare/workers-types').KVNamespace;
			};
			context: import('@cloudflare/workers-types').ExecutionContext;
		}
	}
}

export {};

import type { Alpine } from 'alpinejs';

type AlpineCallback = (alpine: Alpine) => Promise<void>;
type AlpineExtension = () => void;
export const alpineEventsMap = new Set<AlpineCallback>();

export function extendAlpine(callbacks: AlpineCallback|Array<AlpineCallback>) {
	const list = Array.isArray(callbacks) ? callbacks : [callbacks];

	for (const callback of list) {
		alpineEventsMap.add(callback);
	}
}

export async function launchAlpine(plugins: Array<AlpineExtension>) {
	const { default: alpine} = await import('alpinejs');

	for (const plugin of plugins) {
		plugin();
	}

	for await (const callback of alpineEventsMap) {
		await callback(alpine);
	}

	alpine.start();
}

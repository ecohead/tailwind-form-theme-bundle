import { extendAlpine } from '../manager';

type DirectiveOptions = {
	defaultIndex: number;
};

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('tab', (initialStateArguments) => {
			const directiveOptions = initialStateArguments as DirectiveOptions;

			return {
				selected: false,
				init() {
					let tabs: Array<HTMLElement> = [];
					const closestParent = this.$el.closest('[x-data^="tabs("]');

					if (closestParent) {
						tabs = [
							...closestParent.querySelectorAll<HTMLElement>(
								'[x-data^="tab("]',
							),
						];
					}

					this.selected =
						tabs.indexOf(this.$el) === directiveOptions.defaultIndex;
					this.$watch('selected', (selected) => {
						if (selected) {
							this.$el.focus();
						}
					});
				},
				onClick() {
					window.dispatchEvent(
						new CustomEvent('tab-click', {
							detail: this.$el,
						}),
					);
				},
				onKeydown(event: KeyboardEvent) {
					if (
						[
							'ArrowLeft',
							'ArrowRight',
							'Home',
							'PageUp',
							'End',
							'PageDown',
						].includes(event.key)
					) {
						event.preventDefault();
					}

					window.dispatchEvent(
						new CustomEvent('tab-keydown', {
							detail: {
								tab: this.$el,
								key: event.key,
							},
						}),
					);
				},
				onTabSelect(event: CustomEvent) {
					this.selected = event.detail.tab === this.$el;
				},
			};
		});
	});
};

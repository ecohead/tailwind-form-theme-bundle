import { extendAlpine } from '../manager';

type DirectiveOptions = {
	defaultIndex: number;
};

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('tabPanel', (initialStateArguments) => {
			const directiveOptions = initialStateArguments as DirectiveOptions;

			return {
				selected: false,
				init() {
					let panels: Array<HTMLElement> = [];
					const closestParent = this.$el.closest('[x-data^="tabs("]');

					if (closestParent) {
						panels = [
							...closestParent.querySelectorAll<HTMLElement>(
								'[x-data^="tabPanel("]',
							),
						];
					}

					this.selected =
						panels.indexOf(this.$el) === directiveOptions.defaultIndex;
				},
				onTabSelect(event: CustomEvent) {
					this.selected = event.detail.panel === this.$el;
				},
			};
		});
	});
};

import { extendAlpine } from '../manager';

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('tabs', () => ({
			selectedIndex: 0,
			onTabClick(event: CustomEvent) {
				if (!this.$el.contains(event.detail)) {
					return;
				}

				let tabs = [
					...this.$el.querySelectorAll('[x-data^="Components.tab("]'),
				];
				let panels = [
					...this.$el.querySelectorAll('[x-data^="Components.tabPanel("]'),
				];

				let index = tabs.indexOf(event.detail);
				this.selectedIndex = index;

				window.dispatchEvent(
					new CustomEvent('tab-select', {
						detail: {
							tab: event.detail,
							panel: panels[index],
						},
					}),
				);
			},
			onTabKeydown(event: CustomEvent) {
				if (!this.$el.contains(event.detail.tab)) {
					return;
				}

				let tabs = [
					...this.$el.querySelectorAll('[x-data^="Components.tab("]'),
				];
				let tabIndex = tabs.indexOf(event.detail.tab);

				switch (event.detail.key) {
					case 'ArrowLeft': {
						this.onTabClick({
							detail: tabs[(tabIndex - 1 + tabs.length) % tabs.length],
						});

						break;
					}
					case 'ArrowRight': {
						this.onTabClick({ detail: tabs[(tabIndex + 1) % tabs.length] });

						break;
					}
					case 'Home':
					case 'PageUp': {
						this.onTabClick({ detail: tabs[0] });

						break;
					}
					case 'End':
					case 'PageDown': {
						this.onTabClick({ detail: tabs.at(-1) });

						break;
					}
				}
			},
		}));
	});
};

import { extendAlpine } from '../manager';
import { useTrackedPointer } from '../helpers';

type DirectiveOptions = {
	open: boolean;
};

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('menu', (initialStateArguments) => {
			const options = initialStateArguments as DirectiveOptions;
			const pointer = useTrackedPointer();

			return {
				init() {
					this.items = [...this.$el.querySelectorAll('[role="menuitem"]')];
					this.$watch('open', () => {
						if (this.open) {
							this.activeIndex = -1;
						}
					});
				},
				activeDescendant: null,
				activeIndex: null,
				items: null,
				open: options.open,
				focusButton() {
					this.$refs.button.focus();
				},
				async onButtonClick() {
					this.open = !this.open;
					if (this.open) {
						await this.$nextTick(() => {
							this.$refs['menu-items'].focus();
						});
					}
				},
				async onButtonEnter() {
					this.open = !this.open;
					if (this.open) {
						this.activeIndex = 0;
						this.activeDescendant = this.items[this.activeIndex].id;
						await this.$nextTick(() => {
							this.$refs['menu-items'].focus();
						});
					}
				},
				onArrowUp() {
					if (!this.open) {
						this.open = true;
						this.activeIndex = this.items.length - 1;
						this.activeDescendant = this.items[this.activeIndex].id;

						return;
					}

					if (this.activeIndex === 0) {
						return;
					}

					this.activeIndex =
						this.activeIndex === -1
							? this.items.length - 1
							: this.activeIndex - 1;
					this.activeDescendant = this.items[this.activeIndex].id;
				},
				onArrowDown() {
					if (!this.open) {
						this.open = true;
						this.activeIndex = 0;
						this.activeDescendant = this.items[this.activeIndex].id;

						return;
					}

					if (this.activeIndex === this.items.length - 1) {
						return;
					}

					this.activeIndex = this.activeIndex + 1;
					this.activeDescendant = this.items[this.activeIndex].id;
				},
				onClickAway($event: PointerEvent) {
					if (this.open) {
						const focusableSelector = [
							'[contentEditable=true]',
							'[tabindex]',
							'a[href]',
							'area[href]',
							'button:not([disabled])',
							'iframe',
							'input:not([disabled])',
							'select:not([disabled])',
							'textarea:not([disabled])',
						]
							.map((selector) => `${selector}:not([tabindex='-1'])`)
							.join(',');

						this.open = false;

						if (
							$event.target instanceof HTMLElement &&
							!$event.target.closest(focusableSelector)
						) {
							this.focusButton();
						}
					}
				},

				onMouseEnter(event: PointerEvent) {
					pointer.update(event);
				},
				onMouseMove(event: PointerEvent, newIndex: number) {
					if (!pointer.wasMoved(event)) {
						return;
					}
					this.activeIndex = newIndex;
				},
				onMouseLeave(event: PointerEvent) {
					if (!pointer.wasMoved(event)) {
						return;
					}
					this.activeIndex = -1;
				},
			};
		});
	});
};

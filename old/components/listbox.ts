import { extendAlpine } from '../manager';
import { useTrackedPointer } from '../helpers';

type DirectiveOptions = {
	modelName: string;
	open: boolean;
	selectedIndex: number|null;
	activeIndex: number|null;
	items: Array<{ id: number; name: string; value: string; }>;
};

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('listbox', (initialStateArguments) => {
			const directiveOptions = initialStateArguments as DirectiveOptions;
			let modelName = directiveOptions.modelName || 'selected';
			let pointer = useTrackedPointer();

			return {
				activeDescendant: null,
				optionCount: null,
				open: directiveOptions.open,
				activeIndex: directiveOptions.activeIndex,
				selectedIndex: directiveOptions.selectedIndex,
				items: directiveOptions.items,
				init() {
					this.optionCount = this.$refs.listbox.children.length;
					this.$watch('activeIndex', () => {
						if (!this.open) {
							return;
						}

						if (this.activeIndex === null) {
							this.activeDescendant = '';
							return;
						}

						this.activeDescendant =
							this.$refs.listbox.children[this.activeIndex].id;
						this.updateInput();
					});
				},
				get active() {
					return this.items[this.activeIndex];
				},
				get [modelName]() {
					return this.items[this.selectedIndex];
				},
				choose(option: number) {
					this.selectedIndex = option;
					this.open = false;
					this.updateInput();
				},
				async onButtonClick() {
					if (this.open) {
						return;
					}
					this.activeIndex = this.selectedIndex;
					this.open = true;
					await this.$nextTick(() => {
						this.$refs.listbox.focus();
						this.$refs.listbox.children[this.activeIndex].scrollIntoView({
							block: 'nearest',
						});
					});
				},
				onOptionSelect() {
					if (this.activeIndex !== null) {
						this.selectedIndex = this.activeIndex;
					}
					this.open = false;
					this.$refs.button.focus();
				},
				onEscape() {
					this.open = false;
					this.$refs.button.focus();
				},
				onArrowUp() {
					this.activeIndex =
						this.activeIndex - 1 < 0
							? this.optionCount - 1
							: this.activeIndex - 1;
					this.$refs.listbox.children[this.activeIndex].scrollIntoView({
						block: 'nearest',
					});
				},
				onArrowDown() {
					this.activeIndex =
						this.activeIndex + 1 > this.optionCount - 1
							? 0
							: this.activeIndex + 1;
					this.$refs.listbox.children[this.activeIndex].scrollIntoView({
						block: 'nearest',
					});
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
					this.activeIndex = null;
				},
				updateInput() {
					(this.$refs.input as HTMLInputElement).value = this.items[this.selectedIndex].value;
				},
			};
		});
	});
};

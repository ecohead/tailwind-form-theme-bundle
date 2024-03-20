import { extendAlpine } from '../manager';

type DirectiveOptions = {
	initialCheckedIndex: number;
};

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('radioGroup', (initialStateArguments) => {
			const directiveOptions = initialStateArguments as DirectiveOptions;

			return {
				value: undefined,
				active: undefined,
				init() {
					let options = [...this.$el.querySelectorAll('input')];

					this.value = options[directiveOptions.initialCheckedIndex]?.value;

					for (let option of options) {
						option.addEventListener('change', () => {
							this.active = option.value;
						});
						option.addEventListener('focus', () => {
							this.active = option.value;
						});
					}

					window.addEventListener(
						'focus',
						() => {
							if (!(document.activeElement instanceof HTMLElement)) {
								return;
							}
							this.active = undefined;
						},
						true,
					);
				},
			};
		});
	});
};

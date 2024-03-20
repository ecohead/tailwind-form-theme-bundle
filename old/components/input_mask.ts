import { extendAlpine } from '../manager';

type DirectiveOptions = {
	numberPlaceholders: string;
	letterPlaceholder: string;
};

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('inputMask', (initialStateArguments) => {
			const stateArguments = initialStateArguments as Partial<DirectiveOptions>|undefined;
			const directiveOptions: DirectiveOptions = {
				numberPlaceholders: stateArguments?.numberPlaceholders ?? 'XdDmMyY90',
				letterPlaceholder: stateArguments?.letterPlaceholder ?? '_',
			};

			return {
				init() {
					const initialPlaceholder = this.$refs.input.getAttribute('placeholder');

					if (null == initialPlaceholder) {
						return;
					}

					const placeholder = document.createTextNode(initialPlaceholder);

					this.$refs.input.setAttribute('maxlength', placeholder.length.toString());
					this.$refs.input.dataset.placeholder = initialPlaceholder;
					this.$refs.input.removeAttribute('placeholder');

					this.$refs.mask.append(placeholder);
				},
				setValueOfMask() {
					const value = (this.$refs.input as HTMLInputElement).value;
					const placeholder = this.$refs.input.dataset.placeholder;

					if (undefined === placeholder) {
						console.log('ici')
						return '';
					}

					return `<i class="not-italic">${value}</i>${placeholder.slice(value.length)}`;
				},
				handleValueChange() {
					if ((this.$refs.input as HTMLInputElement).value == this.$refs.mask.innerHTML) {
						return; // Continue only if value hasn't changed
					}

					(this.$refs.input as HTMLInputElement).value = this.handleCurrentValue();
					this.$refs.emphasis.innerHTML = this.setValueOfMask();
				},
				handleCurrentValue() {
					const isCharsetPresent = this.$refs.input.dataset.charset;
					const placeholder = isCharsetPresent || this.$refs.input.dataset.placeholder;

					if (!placeholder) {
						return '';
					}

					const value = (this.$refs.input as HTMLInputElement).value;
					const placeholderLength = placeholder.length;
					let newValue = '';

					// strip special characters
					const strippedValue = isCharsetPresent
						? value.replaceAll(/\W/g, '')
						: value.replaceAll(/\D/g, '');

					for (
						let index = 0, stripIndex = 0;
						index < placeholderLength;
						index++
					) {
						const isInt = !Number.isNaN(
							Number.parseInt(strippedValue[stripIndex]),
						);
						const isLetter = strippedValue[stripIndex]
							? strippedValue[stripIndex].match(/[a-z]/i)
							: false;
						const matchesNumber = directiveOptions.numberPlaceholders.includes(
							placeholder[index],
						);
						const matchesLetter = directiveOptions.letterPlaceholder.includes(
							placeholder[index],
						);

						if (
							(matchesNumber && isInt) ||
							(isCharsetPresent && matchesLetter && isLetter)
						) {
							newValue += strippedValue[stripIndex++];
						} else if (
							(!isCharsetPresent && !isInt && matchesNumber) ||
							(isCharsetPresent &&
								((matchesLetter && !isLetter) || (matchesNumber && !isInt)))
						) {
							return newValue;
						} else {
							newValue += placeholder[index];
						}

						if (strippedValue[stripIndex] == undefined) {
							break;
						}
					}

					if (this.$refs.input.dataset.validExample) {
						return this.validateProgress(newValue);
					}

					return newValue;
				},
				validateProgress(value: string) {
					const validExample = this.$refs.input.dataset.validExample;
					const pattern = this.$refs.input.getAttribute('pattern');

					if (!validExample || null === pattern) {
						return '';
					}

					const patternRegex = new RegExp(pattern);
					const placeholder = this.$el.dataset.placeholder;

					if (!placeholder) {
						return '';
					}

					// convert to months
					if (
						value.length == 1 &&
						placeholder.toUpperCase().slice(0, 2) == 'MM'
					) {
						const valueAsNumber = Number(value);

						if (valueAsNumber > 1 && valueAsNumber < 10) {
							value = '0' + value;
						}

						return value;
					}

					// test the value, removing the last character, until what you have is a submatch
					let testValue = '';
					for (let index = value.length; index >= 0; index--) {
						testValue = value + validExample.slice(value.length);

						if (patternRegex.test(testValue)) {
							return value;
						} else {
							value = value.slice(0, Math.max(0, value.length - 1));
						}
					}

					return value;
				},
			};
		});
	});
};

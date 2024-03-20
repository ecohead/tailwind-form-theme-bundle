import { extendAlpine } from '../manager';

function normalizeNumber(value: number, precision: number) {
	return Number(value.toFixed(precision));
}

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('integerField', () => {
			return {
				value: 0,
				disableMinus: false,
				disablePlus: false,
				min: undefined,
				max: undefined,
				step: undefined,
				precision: 0,
				init() {
					const input = this.$refs.input as HTMLInputElement;
					this.min = input.min === '' ? undefined : Number(input.min);
					this.max = input.max === '' ? undefined : Number(input.max);
					this.step = input.step === '' ? undefined : Number(input.step);
					const inputValue = Number(input.valueAsNumber);

					if (this.step) {
						const numberParts = this.step.toString(10).split('.');
						this.precision = numberParts[1] ? numberParts[1].length : 0;
					}

					if (!Number.isNaN(inputValue)) {
						this.value = inputValue;
					} else if (this.min && this.min > 0) {
						this.value = this.min;
					} else if (this.max && this.max < 0) {
						this.value = this.max;
					} else {
						this.value = 0;
					}

					input.valueAsNumber = this.value;
					this.toggleButtons();
				},
				increment() {
					const input = this.$refs.input as HTMLInputElement;
					const value = Number.isNaN(input.valueAsNumber)
						? this.min ?? 0
						: input.valueAsNumber;

					if (undefined !== this.max) {
						if (this.step && value + this.step > this.max) {
							return;
						}

						if (value + 1 > this.max) {
							return;
						}
					}

					const newValue = this.step
						? normalizeNumber(value + this.step, this.precision)
						: value + 1;
					this.value = newValue;
					input.valueAsNumber = newValue;
					this.toggleButtons();
				},
				decrement() {
					const input = this.$refs.input as HTMLInputElement;
					const value = Number.isNaN(input.valueAsNumber)
						? this.max ?? 0
						: input.valueAsNumber;

					if (undefined !== this.min) {
						if (this.step && value - this.step < this.min) {
							return;
						}

						if (value - 1 < this.min) {
							return;
						}
					}

					const newValue = this.step
						? normalizeNumber(value - this.step, this.precision)
						: value - 1;
					this.value = newValue;
					input.valueAsNumber = newValue;
					this.toggleButtons();
				},
				toggleButtons() {
					if (this.step) {
						this.disableMinus = this.value - this.step < this.min;
						this.disablePlus = this.value + this.step > this.max;
					} else {
						this.disableMinus = this.value <= this.min;
						this.disablePlus = this.value >= this.max;
					}
				},
				handleChange() {
					const input = this.$refs.input as HTMLInputElement;
					const inputValue = input.valueAsNumber;
					console.log(inputValue)

					if (this.min && this.min > inputValue) {
						this.value = this.min;
					} else if (this.max && this.max < inputValue) {
						this.value = this.max;
					} else {
						this.value = inputValue;
					}

					input.valueAsNumber = this.value;
					this.toggleButtons();
				},
			};
		});
	});
};

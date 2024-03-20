import { extendAlpine } from '../manager';

export default () => {
    extendAlpine(async (alpine) => {
        await import('vanilla-colorful');
        await import('vanilla-colorful/hex-input.js');

        alpine.data('colorPicker', () => {
            return {
                updateInput(event: CustomEvent<{ value: string }>) {
                    (this.$refs.input as HTMLInputElement).value = event.detail.value;
                },
                updatePicker(event: CustomEvent<{ value: string }>) {
                    this.$refs.picker.setAttribute('color', event.detail.value);
                }
            };
        });
    });
}

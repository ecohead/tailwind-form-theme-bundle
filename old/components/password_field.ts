import { extendAlpine } from '../manager';

export default () => {
	extendAlpine(async (alpine) => {
		alpine.data('passwordField', () => {
			return {
				visible: false,
				toggleType() {
					const input = (this.$refs.input as HTMLInputElement);

					if (input.type === 'password') {
						input.type = 'text';
						this.visible = true;
					} else {
						input.type = 'password';
						this.visible = false;
					}
				},
			};
		});
	});
};

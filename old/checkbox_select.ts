export function enableCheckboxSelection() {
	for (const input of document.querySelectorAll<HTMLInputElement>('[data-select-all]')) {
		const formContainer = input.closest('form');
		const searchPattern = input.dataset.selectAll;

		if (null === formContainer || undefined === searchPattern) {
			continue;
		}

		const otherCheckboxesValues = formContainer.querySelectorAll<HTMLInputElement>(`[name="${searchPattern}"]`);

		if (otherCheckboxesValues.length <= 0) {
			continue;
		}

		let checkCount = 0;
		const maxCount = otherCheckboxesValues.length;

		for (const checkbox of otherCheckboxesValues) {
			checkbox.addEventListener('change', () => {
				if (checkbox.checked) {
					++checkCount;
				} else {
					--checkCount;
				}

				if (checkCount === 0) {
					input.checked = false;
					input.indeterminate = false;
				} else if (checkCount === maxCount) {
					input.indeterminate = false;
					input.checked = true;
				} else {
					input.indeterminate = true;
				}
			});
		}

		input.addEventListener('change', () => {
			input.indeterminate = false;
			for (const checkbox of otherCheckboxesValues) {
				checkbox.checked = input.checked;
			}

			checkCount = input.checked ? maxCount : 0;
		});
	}
}

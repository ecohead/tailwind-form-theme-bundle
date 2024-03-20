import { extendAlpine } from '../manager';

export default () => {
	extendAlpine(async (alpine) => {
		alpine.directive('tooltip', (node, parameters, utilities) => {
			if (
				node.nodeType !== node.ELEMENT_NODE ||
				!(node instanceof HTMLElement)
			) {
				return;
			}

			const { modifiers, expression } = parameters;
			const { cleanup } = utilities;

			const tooltipText = expression;
			const tooltipArrow = !modifiers.includes('noarrow');
			let tooltipPosition = 'top';
			const tooltipId = `tooltip-${window.crypto.randomUUID()}`;
			const positions = ['top', 'bottom', 'left', 'right'];
			const elementPosition = window.getComputedStyle(node).position;

			for (let position of positions) {
				if (modifiers.includes(position)) {
					tooltipPosition = position;
					break;
				}
			}

			if (!['relative', 'absolute', 'fixed'].includes(elementPosition)) {
				node.style.position = 'relative';
			}

			let tooltipHTML = `
				<div
					id="${tooltipId}"
					x-data="{ tooltipVisible: false, tooltipText: '${tooltipText}', tooltipArrow: ${tooltipArrow}, tooltipPosition: '${tooltipPosition}' }"
					x-ref="tooltip"
					x-init="setTimeout(function(){ tooltipVisible = true; }, 1);"
					x-show="tooltipVisible"
					:class="{ 'top-0 left-1/2 -translate-x-1/2 -mt-0.5 -translate-y-full' : tooltipPosition == 'top', 'top-1/2 -translate-y-1/2 -ml-1.5 left-0 -translate-x-full' : tooltipPosition == 'left', 'bottom-0 left-1/2 -translate-x-1/2 -mb-0.5 translate-y-full' : tooltipPosition == 'bottom', 'top-1/2 -translate-y-1/2 -mr-1.5 right-0 translate-x-full' : tooltipPosition == 'right' }"
					class="absolute w-auto text-sm"
					x-cloak
				>
						<div
							x-show="tooltipVisible"
							x-transition
							class="relative px-2 py-1 text-white bg-black rounded bg-opacity-90"
						>
								<p
									x-text="tooltipText"
									class="flex-shrink-0 block text-xs whitespace-nowrap"
								></p>
								<div
									x-ref="tooltipArrow"
									x-show="tooltipArrow"
									:class="{ 'bottom-0 -translate-x-1/2 left-1/2 w-2.5 translate-y-full' : tooltipPosition == 'top', 'right-0 -translate-y-1/2 top-1/2 h-2.5 -mt-px translate-x-full' : tooltipPosition == 'left', 'top-0 -translate-x-1/2 left-1/2 w-2.5 -translate-y-full' : tooltipPosition == 'bottom', 'left-0 -translate-y-1/2 top-1/2 h-2.5 -mt-px -translate-x-full' : tooltipPosition == 'right' }"
									class="absolute inline-flex items-center justify-center overflow-hidden"
								>
										<div
											:class="{ 'origin-top-left -rotate-45' : tooltipPosition == 'top', 'origin-top-left rotate-45' : tooltipPosition == 'left', 'origin-bottom-left rotate-45' : tooltipPosition == 'bottom', 'origin-top-right -rotate-45' : tooltipPosition == 'right' }"
											class="w-1.5 h-1.5 transform bg-black bg-opacity-90"
										></div>
								</div>
						</div>
				</div>
		`;

			node.dataset.tooltip = tooltipId;

			const mouseEnter = () => {
				node.insertAdjacentHTML('beforeend', tooltipHTML);
			};

			const mouseLeave = (event: MouseEvent) => {
				if (
					event.target instanceof HTMLElement &&
					event.target.dataset.tooltip
				) {
					document.querySelector(`#${event.target?.dataset.tooltip}`)?.remove();
				}
			};

			node.addEventListener('mouseenter', mouseEnter);
			node.addEventListener('mouseleave', mouseLeave);

			cleanup(() => {
				node.removeEventListener('mouseenter', mouseEnter);
				node.removeEventListener('mouseleave', mouseLeave);
			});
		});
	});
};

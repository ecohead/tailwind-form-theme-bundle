export function useTrackedPointer() {
	let lastPos: [number, number] = [-1, -1]

	return {
		wasMoved(evt: PointerEvent) {
			let newPos: [number, number] = [evt.screenX, evt.screenY]

			if (lastPos[0] === newPos[0] && lastPos[1] === newPos[1]) {
				return false
			}

			lastPos = newPos
			return true
		},

		update(evt: PointerEvent) {
			lastPos = [evt.screenX, evt.screenY]
		},
	}
}

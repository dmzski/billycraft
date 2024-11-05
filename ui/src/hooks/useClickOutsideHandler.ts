import { RefObject, useEffect, useRef } from "react";

const useClickOutsideHandler = (
	ref: RefObject<HTMLElement>,
	callback: (event: MouseEvent | TouchEvent | FocusEvent) => void,
	additionalRef?: RefObject<HTMLElement>[],
): void => {
	const callbackFnRef = useRef(callback);

	useEffect(() => {
		const handler = (event: MouseEvent | TouchEvent | FocusEvent) => {
			// If a fallback ref that prevent click outside is clicked
			if (
				additionalRef?.some(
					(aRef) =>
						aRef.current && aRef.current.contains(event.target as HTMLElement),
				)
			) {
				return;
			}
			if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
				callbackFnRef.current?.(event);
			}
		};

		// Bind the event listener
		document.addEventListener("mouseup", handler);
		document.addEventListener("blur", handler);
		document.addEventListener("touchend", handler);
		return () => {
			// Unbind the event listener on clean up
			document.addEventListener("blur", handler);
			document.removeEventListener("mouseup", handler);
			document.removeEventListener("touchend", handler);
		};
	}, [ref]);

	useEffect(() => {
		callbackFnRef.current = callback;
	}, [callback]);
};

export default useClickOutsideHandler;

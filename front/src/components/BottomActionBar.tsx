import {
	type MutableRefObject,
	type ReactNode,
	type RefObject,
	useEffect,
	useState,
} from "react"

type BottomActionBarProps = {
	containerRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>
	children: ReactNode
}
export const BottomActionBar = ({
	containerRef,
	children,
}: BottomActionBarProps) => {
	const initialRect = containerRef.current?.getBoundingClientRect()
	const [x, setX] = useState(
		initialRect ? initialRect?.left + (initialRect?.width ?? 0) / 2 : -9999,
	)

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			const divRects = entries[0]?.target.getBoundingClientRect()
			setX(divRects ? divRects?.left + (divRects?.width ?? 0) / 2 : -9999)
		})
		if (containerRef.current) {
			observer.observe(containerRef.current)
		}

		return () => {
			observer.disconnect()
		}
	}, [containerRef])

	return (
		<div
			className="fixed bottom-2 transform translate -translate-x-2/4 max-w-[90svw] w-full lg:max-w-lg p-4 rounded-md bg-popover border"
			style={{
				left: x,
			}}
		>
			{children}
		</div>
	)
}

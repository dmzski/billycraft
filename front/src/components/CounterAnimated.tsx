import { useState, useEffect } from "react"

const CounterAnimated = ({
	value,
	format,
}: {
	value: number
	format?: (value: number) => string
}) => {
	const [counter, setCounter] = useState(0)

	useEffect(() => {
		setCounter(0)
		let initialCounter = 0
		const interval = setInterval(() => {
			let speed = 1
			if (value > 1000) {
				speed = 10
				if (value > 10000) {
					speed = 30
				}
				if (value > 100000) {
					speed = 60
				}
			}
			initialCounter += Math.log(initialCounter + 2) * speed
			setCounter(initialCounter)
			if (initialCounter >= value) {
				setCounter(value)
				clearInterval(interval)
			}
		}, 1)

		return () => {
			clearInterval(interval)
		}
	}, [value])

	return <span>{format ? format(counter) : counter}</span>
}

export default CounterAnimated

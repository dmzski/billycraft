import React from 'react'

const CounterAnimated = ({ value }: { value: number }): JSX.Element => {
  const [counter, setCounter] = React.useState(0)

  React.useEffect(() => {
    setCounter(0)
    let initialCounter = 0
    const interval = setInterval(() => {
      let speed = 1
      if (value > 1000) {
        speed = 20
        if (value > 60000) {
          speed = 50
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

  return <span>{counter.toFixed(2)}</span>
}

export default CounterAnimated

import React from "react";

const CounterAnimated: React.FC<{ value: number }> = ({ value }) => {
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    setCounter(0);
    let initialCounter = 0;
    let interval = setInterval(() => {
      initialCounter += Math.log(initialCounter + 2) * (value && value > 1000 ? (value > 60000 ? 50 : 20) : 1);
      setCounter(initialCounter);
      if (initialCounter >= value) {
        setCounter(value);
        clearInterval(interval);
      }
    }, 1);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return <span>{counter.toFixed(2)}</span>;
};

export default CounterAnimated;

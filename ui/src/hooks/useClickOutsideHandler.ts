import { RefObject, useEffect, useRef } from 'react'

const useClickOutsideHandler = (
  ref: RefObject<HTMLElement>,
  callback: (event: MouseEvent | TouchEvent | FocusEvent) => void,
): void => {
  const callbackFnRef = useRef(callback)

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent | FocusEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        callbackFnRef.current?.(event)
      }
    }

    // Bind the event listener
    document.addEventListener('mouseup', handler)
    document.addEventListener('blur', handler)
    document.addEventListener('touchend', handler)
    return () => {
      // Unbind the event listener on clean up
      document.addEventListener('blur', handler)
      document.removeEventListener('mouseup', handler)
      document.removeEventListener('touchend', handler)
    }
  }, [ref])

  useEffect(() => {
    callbackFnRef.current = callback
  }, [callback])
}

export default useClickOutsideHandler

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { CustomToast, ToastContainer } from '../components/CustomToast'
import { Toast, ToastVariant } from '../models/Toast'

type ToastInfo = {
  message: string
  variant: ToastVariant
  callback?: () => ReactNode
  vertical?: string
  horizontal?: string
  duration?: number
}

type ToastProviderProps = {
  children: ReactNode
  duration?: number
}

type ToastContextType = {
  show: (info: ToastInfo) => void
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

const ToastProvider = ({ children, duration = 3000 }: ToastProviderProps): JSX.Element => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [nextToast, setNextToast] = useState<Toast>()

  const show = useCallback((info: ToastInfo) => {
    const newToast = new Toast()
    newToast.callback = info.callback
    newToast.message = info.message
    newToast.variant = info.variant
    newToast.duration = info.duration ? info.duration : duration
    setToasts(current => [...current, newToast])
  }, [])

  const onCloseToast = () => {
    if (nextToast) {
      setNextToast({ ...nextToast, open: false })
      if (nextToast.callback) nextToast.callback()
    }
    setTimeout(() => {
      if (toasts.length > 0) {
        setNextToast(toasts.shift())
      } else {
        setNextToast(undefined)
      }
    }, 1000)
  }

  useEffect(() => {
    if (!nextToast) {
      setNextToast(toasts.shift())
    }
  }, [toasts, nextToast])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {nextToast && (
          <CustomToast
            duration={nextToast.duration}
            key={nextToast.id}
            message={nextToast.message}
            variant={nextToast.variant}
            onClose={onCloseToast}
          />
        )}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

const useToast = (): ToastContextType => useContext(ToastContext)

export { ToastProvider, useToast }

import {
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Toast from './Toast'

type ToastOptions = {
  variant: ComponentProps<typeof Toast>['variant']
  callback?: () => void
  duration?: number
}
type ToastInfo = {
  render: ReactNode
  id: number
  closed: boolean
} & ToastOptions

export type ToastProviderProps = {
  children: ReactNode
  duration?: number
  maxConcurrent?: number
}

type ToastContextType = {
  show: (render: ReactNode, info?: ToastOptions) => void
  destructive: (render: ReactNode, info?: ToastOptions) => void
}
const ToastContext = createContext<ToastContextType>({} as ToastContextType)

export const ToastProvider = ({
  children,
  duration = 3000,
  maxConcurrent = 5,
}: ToastProviderProps) => {
  const counterRef = useRef(0)
  const [toasts, setToasts] = useState<ToastInfo[]>([])

  const show = useCallback(
    (render: ReactNode, info: ToastOptions = { variant: 'default' }) => {
      const newToast = {} as ToastInfo
      newToast.id = counterRef.current
      counterRef.current += 1
      newToast.callback = info.callback
      newToast.render = render
      newToast.closed = false
      newToast.variant = info.variant
      newToast.duration = info.duration ?? duration
      setToasts(current => [...current, newToast])
    },
    [duration],
  )

  const destructive = useCallback(
    (render: ReactNode, info?: ToastOptions) => {
      show(render, { ...info, variant: 'destructive' })
    },
    [show],
  )

  const onCloseToast = useCallback(
    (toastId: number) => {
      const index = toasts.findIndex(({ id }) => id === toastId)
      if (index > -1) {
        toasts[index]?.callback?.()
        const tmp = [...toasts]
        tmp[index].closed = true
        setToasts(tmp)
      }
    },
    [toasts],
  )

  useEffect(() => {
    if (toasts.length && toasts.every(({ closed }) => closed)) {
      setToasts([])
    }
  }, [toasts])

  const value = useMemo(() => ({ show, destructive }), [show, destructive])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 ? (
        <div className="fixed bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
          {toasts
            .filter(({ closed }) => !closed)
            .slice(0, maxConcurrent)
            .map(toast => (
              <Toast
                id={toast.id}
                key={toast.id}
                duration={toast.duration ?? duration}
                variant={toast.variant}
                onClose={onCloseToast}
              >
                {toast.render}
              </Toast>
            ))}
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}

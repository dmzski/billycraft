import React from "react";
import { CustomToast, ToastContainer } from "../components/CustomToast";
import { Toast, ToastVariant } from "../models/Toast";

const ToastContext = React.createContext<any>({});

type ToastInfo = {
  message: string;
  variant: ToastVariant;
  callback?: () => any;
  vertical?: string;
  horizontal?: string;
  duration?: number;
};

type ToastProviderProps = {
  children: any;
  duration?: number;
  horizontal?: string;
  vertical?: string;
};

const ToastProvider = ({ children, duration = 3000 }: ToastProviderProps): JSX.Element => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [nextToast, setNextToast] = React.useState<Toast>();

  const show = (info: ToastInfo) => {
    const newToast = new Toast();
    newToast.callback = info.callback;
    newToast.message = info.message;
    newToast.variant = info.variant;
    newToast.duration = info.duration ? info.duration : duration;
    setToasts([...toasts, newToast]);
  };

  const onCloseToast = () => {
    if (nextToast) {
      setNextToast({ ...nextToast, open: false });
      if (nextToast.callback) nextToast.callback();
    }
    setTimeout(() => {
      if (toasts.length > 0) {
        setNextToast(toasts.shift());
      } else {
        setNextToast(undefined);
      }
    }, 1000);
  };

  React.useEffect(() => {
    if (!nextToast) {
      setNextToast(toasts.shift());
    }
  }, [toasts, nextToast]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastContainer>
        {nextToast && (
          <CustomToast duration={nextToast.duration} key={nextToast.id} message={nextToast.message} variant={nextToast.variant} onClose={onCloseToast} />
        )}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

const useToast = (): any => {
  return React.useContext(ToastContext);
};

export { ToastProvider, useToast };

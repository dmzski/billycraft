import React from "react";
import { CustomToast, ToastContainer } from "../components/CustomToast";
import { Toast, ToastVariant } from "../models/Toast";

const ToastContext = React.createContext<any>({});

type ToastInfo = {
  message: string;
  variant: ToastVariant;
  callback?: Function;
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

const ToastProvider: React.FC<any> = ({ children, duration = 5000, horizontal = "center", vertical = "bottom" }) => {
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
          <CustomToast
            duration={nextToast.duration}
            open={nextToast.open}
            key={nextToast.id}
            message={nextToast.message}
            horizontal={nextToast.horizontal ? nextToast.horizontal : horizontal}
            vertical={nextToast.vertical ? nextToast.vertical : vertical}
            variant={nextToast.variant}
            onClose={onCloseToast}
          />
        )}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  return React.useContext(ToastContext);
};

export { ToastProvider, useToast };

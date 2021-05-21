import React, { SyntheticEvent } from "react";
import { ToastVariant } from "models/Toast";

type ToastContainerProps = {
  children: React.ReactNode;
};
export const ToastContainer = (props: ToastContainerProps): JSX.Element => {
  return <div className="overflow-hidden z-20 py-2 fixed bottom-0 right-0 flex flex-col-reverse w-72">{props.children}</div>;
};

const variants = {
  default: {
    toast: "shadow bg-white rounded pt-2 text-black",
    progressBar: "bg-black",
  },
  success: {
    toast: "shadow bg-success-600 rounded pt-2 text-white",
    progressBar: "bg-white opacity-50",
  },
  errror: {
    toast: "shadow bg-error-600 rounded pt-2 text-white",
    progressBar: "bg-white opacity-50",
  },
  warning: {
    toast: "shadow bg-warning-500 rounded pt-2 text-white",
    progressBar: "bg-white opacity-50",
  },
  info: {
    toast: "shadow bg-info-600 rounded pt-2 text-white",
    progressBar: "bg-white opacity-50",
  },
};

type ToastProps = {
  onClose: () => any;
  duration: number;
  message: string;
  variant: ToastVariant;
};

export const CustomToast = ({ onClose, duration = 3000, message, variant }: ToastProps): JSX.Element => {
  const toastRef = React.useRef<any>(null);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const handleClose = (_event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    toastRef.current.classList.add("translate-x-72");
    setTimeout(() => {
      onClose();
    }, 500);
  };

  React.useEffect(() => {
    const timeoutAnimation = setTimeout(() => {
      if (toastRef.current) {
        toastRef.current.classList.remove("translate-x-72");
        progressBarRef.current?.classList.add("-translate-x-full");
      }
    });
    const timeout = setTimeout(() => {
      toastRef.current.classList.add("translate-x-72");
      setTimeout(() => {
        onClose();
      }, 500);
    }, duration);

    return () => {
      clearTimeout(timeoutAnimation);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={toastRef}
      onClick={handleClose}
      className={`mr-2 transition duration-500 transition-transform transform translate-x-72 overflow-hidden flex flex-col ${
        (variants as any)[variant]?.toast ?? variants.default.toast
      }`}
    >
      <div className="flex-grow px-2">{message}</div>
      <div
        ref={progressBarRef}
        className={`${
          (variants as any)[variant]?.progressBar ?? variants.default.progressBar
        } ease-linear mt-2 h-1 w-full transition transition-transform transform`}
        style={{ transitionDuration: `${Math.round(duration / 1000)}s` }}
      />
    </div>
  );
};

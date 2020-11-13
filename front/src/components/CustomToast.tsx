import React, { SyntheticEvent } from "react";

export function ToastContainer(props: any) {
  return <div className="toast-container">{props.children}</div>;
}

export const CustomToast: React.FC<any> = ({ open, onClose, duration = 3000, message, variant, vertical, horizontal }) => {
  const toastRef = React.useRef<any>(null);
  const progressBarRef = React.useRef<any>(null);
  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      onClose();
    }, duration);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  React.useEffect(() => {
    let timeoutAnimation = setTimeout(() => {
      if (toastRef.current) {
        toastRef.current.className += " open";
        progressBarRef.current.style.width = 0;
      }
    }, 100);

    return () => {
      clearTimeout(timeoutAnimation);
    };
  }, []);

  return (
    <div ref={toastRef} onClick={handleClose} className={"toast " + (open ? "" : "hide") + " " + (variant || "default")}>
      {message}
      <div ref={progressBarRef} className="progress-bar" style={{ transition: "width " + duration + "ms linear" }}></div>
    </div>
  );
};

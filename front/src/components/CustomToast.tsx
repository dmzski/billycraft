import React, { SyntheticEvent } from "react";

export function ToastContainer(props: any) {
  return <div className="toast-container">{props.children}</div>;
}

export const CustomToast: React.FC<any> = ({ open, onClose, duration = 3000, message, variant, vertical, horizontal }) => {
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

  return <div className={"toast " + (open ? "open" : "hide") + " " + (variant || "default")}>{message}</div>;
};

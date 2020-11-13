import React from "react";
import ReactDOM from "react-dom";

const CustomModal: React.FC<any> = ({ isOpen, children, onRequestClose, style, closeOnOverlayClick }) => {
  const overlayRef = React.useRef<any>(null);
  const containerRef = React.useRef<any>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    let timeout: any;
    const containerEl = containerRef.current;
    if (overlayRef.current && containerEl) {
      if (isOpen) {
        document.addEventListener("keyup", (e: KeyboardEvent) => {
          if (e.key === "Escape" && e.target === document.body) {
            onRequestClose(e);
            setTimeout(() => {
              setVisible(false);
            }, 500);
          }
        });
        if (containerEl) {
          containerEl.className = containerEl.className.replace(/\bhide\b/, "") + " open";
        }
        timeout = setTimeout(() => {
          if (overlayRef.current) {
            overlayRef.current.style.overflow = "auto";
          }
        }, 200);
      } else {
        overlayRef.current.style.overflow = "hidden";
        containerEl.className = containerEl.className.replace(/\bopen\b/, "") + " hide";
      }
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen, overlayRef, containerRef, setVisible, visible, onRequestClose]);

  React.useEffect(() => {
    let timeout: any;
    if (isOpen) {
      setVisible(true);
    } else {
      timeout = setTimeout(() => {
        setVisible(false);
      }, 500);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  const handleClose = (e: any) => {
    if (isOpen) {
      onRequestClose(e);
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }
  };

  return ReactDOM.createPortal(
    !visible ? null : (
      <div
        ref={overlayRef}
        className="custom-modal-overlay"
        style={{ display: "flex" }}
        onClick={(e: any) => {
          if (closeOnOverlayClick) handleClose(e);
          else e.stopPropagation();
        }}
      >
        <div ref={containerRef} className="custom-modal-container hide" style={style ? style.content : null} onClick={(e: any) => e.stopPropagation()}>
          <button
            onClick={handleClose}
            className="outline-none hover:shadow-outline flex items-center justify-center absolute top-0 bg-white text-gray-700 p-2 rounded-full"
            style={{ right: -50 }}
          >
            <span className="p-0 material-icons">clear</span>
          </button>
          {children}
        </div>
      </div>
    ),
    document.getElementById("modal-container")!
  );
};

export default CustomModal;

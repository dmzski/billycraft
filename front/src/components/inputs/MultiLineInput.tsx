import React from "react";

const MultiLineInput: React.FC<any> = ({ className, value, onChange, placeholder, wrap, disabled }) => {
  const textAreaRef = React.useRef<any>(null);
  React.useEffect(() => {
    function resize() {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
    /* 0-timeout to get the already changed textAreaRef.current */
    function delayedResize() {
      window.setTimeout(resize, 0);
    }
    const element = textAreaRef.current;
    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("change", resize);
      textAreaRef.current.addEventListener("cut", delayedResize);
      textAreaRef.current.addEventListener("paste", delayedResize);
      textAreaRef.current.addEventListener("drop", delayedResize);
      textAreaRef.current.addEventListener("keydown", delayedResize);

      if (value) {
        delayedResize();
      }
    }
    return () => {
      if (element) {
        element.removeEventListener("change", resize);
        element.removeEventListener("cut", delayedResize);
        element.removeEventListener("paste", delayedResize);
        element.removeEventListener("drop", delayedResize);
        element.removeEventListener("keydown", delayedResize);
      }
    };
  }, [textAreaRef, value]);
  return (
    <textarea
      ref={textAreaRef}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ resize: "none" }}
      wrap={wrap}
      maxLength={255}
      disabled={disabled}
      rows={1}
    ></textarea>
  );
};

export default MultiLineInput;

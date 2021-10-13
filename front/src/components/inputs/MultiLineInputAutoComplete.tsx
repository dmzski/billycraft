/* eslint-disable  */
import React from "react";

const MultiLineInputAutoComplete = ({
  id,
  isLoading,
  isError,
  className,
  value,
  onChange,
  placeholder,
  wrap,
  disabled,
  options,
  onOptionClick,
}: any) => {
  const textAreaRef = React.useRef<any>(null);
  let currentId = 0;
  const [focused, setFocused] = React.useState<any>(null);
  const [open, setOpen] = React.useState<any>(false);

  const handleClickOption = (event: any, option: any) => {
    onOptionClick(event, option);
    setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  React.useEffect(() => {
    function moveFocus(n: number) {
      if (!focused) {
        setFocused(document.getElementById(id + "-option-0"));
      } else {
        const focusId = focused.id;
        const actualN = Number(
          focusId.split("-")[focusId.split("-").length - 1]
        );
        const nextId = id + "-option-" + (actualN + n);
        const nextFocus = document.getElementById(nextId);
        if (nextFocus) {
          setFocused(nextFocus);
        }
      }
    }

    const handleKeyUp = (e: any) => {
      if (e.key === "Escape") {
        setOpen(false);
        e.target.blur();
      } else {
        if (!open) {
          setOpen(true);
        }
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        moveFocus(e.key === "ArrowDown" ? 1 : -1);
      }
      if (e.key === "Enter") {
        focused.click();
      }
    };

    const searchInput = document.getElementById(id);
    if (searchInput) {
      searchInput.addEventListener("keyup", handleKeyUp);
    }

    if (focused) {
      if (!focused.classList.contains("focused")) {
        focused.className += " bg-primary-200";
      }
    }

    return () => {
      if (searchInput) {
        searchInput.removeEventListener("keyup", handleKeyUp);
      }

      if (focused) {
        focused.className = focused.className.replace(" bg-primary-200", "");
      }
    };
  }, [focused, setFocused, id]);

  React.useEffect(() => {
    const searchInput = document.getElementById(id);

    const handleFocus = (e: any) => {
      if (options || isLoading || isError) {
        setOpen(true);
      }
    };

    const handleFocusLeave = (e: any) => {
      setOpen(false);
    };
    const preventHandleFocusLeave = (e: any) => {
      if (e.target.id === id || e.target.id === id + "-result") {
        e.stopPropagation();
      }
    };
    document.addEventListener("click", handleFocusLeave);
    searchInput?.addEventListener("focus", handleFocus);
    searchInput?.addEventListener("click", preventHandleFocusLeave);
    document
      .getElementById(id + "-result")
      ?.addEventListener("click", preventHandleFocusLeave);

    return () => {
      if (searchInput) searchInput.removeEventListener("focus", handleFocus);
      document
        .getElementById(id + "-result")
        ?.removeEventListener("click", preventHandleFocusLeave);
      searchInput?.removeEventListener("click", preventHandleFocusLeave);
      document.removeEventListener("click", handleFocusLeave);
    };
  }, [options, isLoading, isError, id]);

  React.useEffect(() => {
    function resize() {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
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

  const getValueComponent = (value: any) => {
    return (
      <li
        key={value.id}
        id={id + "-option-" + currentId++}
        className="py-2 px-2 hover:bg-primary-200 cursor-pointer"
        onClick={(e: any) => handleClickOption(e, value)}
      >
        {value.description}
      </li>
    );
  };

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        ref={textAreaRef}
        className={className + " multiline-input"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ resize: "none" }}
        wrap={wrap}
        maxLength={255}
        disabled={disabled}
        rows={1}
      ></textarea>
      {!disabled && open && value && value.length > 0 && !disabled && (
        <ul
          style={{ top: "100%" }}
          id={id + "-result"}
          className="z-10 left-0 flex flex-col border border-gray-200 absolute w-full bg-white shadow-md rounded-md"
        >
          {isLoading && <div className="absolute right-0">...</div>}
          {isError && <span>Une erreur est survenue</span>}
          {options &&
            options.map((option: any, index: number) =>
              getValueComponent(option)
            )}
        </ul>
      )}
    </div>
  );
};

export default MultiLineInputAutoComplete;

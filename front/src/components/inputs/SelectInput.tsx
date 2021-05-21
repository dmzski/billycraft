/* eslint-disable  */
import React from "react";
import Loader from "../Loader";

type SelectInputProps = {
  id: string;
  data?: any;
  isLoading?: boolean;
  value: string;
  onChange: (e: any) => any;
  isError?: boolean;
  onClickOption: (event: any, value: any, header?: any) => any;
  defaultOpen?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};
const SelectInput = ({
  id,
  data,
  isLoading,
  value,
  onChange,
  isError,
  onClickOption,
  defaultOpen,
  disabled,
  placeholder = "Rechercher",
  className,
}: SelectInputProps) => {
  let currentId = 0;
  const [focused, setFocused] = React.useState<any>(null);
  const [open, setOpen] = React.useState<any>(defaultOpen);

  const handleClickOption = (event: any, option: any, header?: any) => {
    onClickOption(event, option, header);
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
        const actualN = parseInt(focusId.split("-")[focusId.split("-").length - 1]);
        const nextId = id + "-option-" + (actualN + n);
        const nextFocus = document.getElementById(nextId);
        if (nextFocus) {
          setFocused(nextFocus);
        } else {
          setFocused(document.getElementById(id + "-option-0"));
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
      if (data || isLoading || isError) {
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
    document.getElementById(id + "-result")?.addEventListener("click", preventHandleFocusLeave);

    return () => {
      if (searchInput) searchInput.removeEventListener("focus", handleFocus);
      document.getElementById(id + "-result")?.removeEventListener("click", preventHandleFocusLeave);
      searchInput?.removeEventListener("click", preventHandleFocusLeave);
      document.removeEventListener("click", handleFocusLeave);
    };
  }, [data, isLoading, isError, id]);

  const getValueComponent = (value: any, header?: any) => {
    return (
      <li
        key={value.id}
        id={id + "-option-" + currentId++}
        className="py-2 px-2 hover:bg-primary-200 cursor-pointer"
        onClick={(e: any) => handleClickOption(e, value, header)}
      >
        {value.id} - {value.description}
      </li>
    );
  };

  return (
    <div className="relative w-full">
      <input disabled={disabled} id={id} className={className || "select-input"} placeholder={placeholder} type="text" value={value} onChange={onChange} />
      {isLoading && (
        <div className="absolute top-0 flex w-auto h-full items-center" style={{ right: "1rem" }}>
          <Loader size="small" />
        </div>
      )}
      {open && value && value.length > 0 && !disabled && (
        <div
          style={{ top: "100%" }}
          id={id + "-result"}
          className=" flex flex-col justify-center items-center border border-gray-200 absolute w-full bg-white shadow-md rounded-md"
        >
          {isError && <span>Une erreur est survenue</span>}
          {data &&
            data.map((option: any, index: number) => (
              <div className="w-full" key={index}>
                {option.header && <div className="px-2 py-2 font-bold text-lg">{option.header}</div>}
                <ul>{option.values && option.values.map((value: any) => getValueComponent(value, option.header))}</ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SelectInput;

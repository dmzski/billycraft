import React from "react";
import Loader from "../Loader";

const SelectInput: React.FC<any> = ({ id, data, isLoading, value, onChange, isError, onClickOption, defaultOpen }) => {
  let currentId = 0;
  const [focused, setFocused] = React.useState<any>(null);
  const [open, setOpen] = React.useState<any>(defaultOpen);

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
    searchInput?.addEventListener("focus", handleFocus);
    if (data || isLoading || isError) {
      setOpen(true);
    }

    return () => {
      if (searchInput) searchInput.removeEventListener("focus", handleFocus);
    };
  }, [data, isLoading, isError, id]);

  const getValueComponent = (value: any, header?: any) => {
    return (
      <li
        key={value.id}
        id={id + "-option-" + currentId++}
        className="py-2 px-2 hover:bg-primary-200 cursor-pointer"
        onClick={(e: any) => onClickOption(value, header, e)}
      >
        {value.id} - {value.description}
      </li>
    );
  };

  return (
    <div>
      <input id={id} className="search-input" placeholder="Rechercher" type="text" value={value} onChange={onChange} />
      {open && value.length > 0 && (
        <div
          style={{ top: "100%" }}
          id="search-result"
          className=" flex flex-col justify-center items-center border border-gray-200 absolute w-full bg-white shadow-md rounded-md"
        >
          {isLoading && <Loader />}
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

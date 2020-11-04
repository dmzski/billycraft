import React from "react";

const AutoCompleteInput: React.FC<any> = ({ label, type, value, onChange, placeholder, id, name, ref, divClassName, options, onOptionClick, disabled }) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef(null);
  const handleOptionClick = (option: any) => (e: any) => {
    setOpen(false);
    onOptionClick(option);
  };

  React.useEffect(() => {
    if (options && options.findIndex((option: any) => option.name === value) < 0 && !disabled) {
      setOpen(true);
    }
    if (options && options.findIndex((option: any) => option.name === value) > -1) setOpen(false);
  }, [value, options]);
  return (
    <div className={"autocomplete-input " + divClassName}>
      <label className="block text-gray-700 text-sm font-bold mb-1 ml-1" htmlFor={name}>
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
      {options && options.length > 0 && (
        <div className={"autocomplete-container" + (open ? " open" : " hide")}>
          <ul>
            {options.map((option: any) => (
              <li key={option.id} value={option.id} onClick={handleOptionClick(option)}>
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

AutoCompleteInput.defaultProps = {
  type: "text",
};

export default AutoCompleteInput;

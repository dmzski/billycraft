import React from "react";

const BaseInput: React.FC<any> = ({ label, type, value, onChange, placeholder, id, name, ref, divClassName, className, disabled, ...props }) => {
  return (
    <div className={divClassName}>
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-1 ml-1" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " + className}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

BaseInput.defaultProps = {
  type: "text",
};

export default BaseInput;

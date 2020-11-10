import React from "react";

const BaseSelect: React.FC<any> = ({ name, id, onChange, options, value }) => {
  console.log(value, options);
  return (
    <select onChange={onChange} className="input-select bg-white border-gray-200">
      <option>Sélectionner...</option>
      {options.map((opt: any) => (
        <option value={opt.id} selected={value === opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
};

export default BaseSelect;

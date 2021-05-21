/* eslint-disable  */
import React from "react";

const BaseSelect = ({ name, id, onChange, options, value, disabled }: any) => {
  return (
    <select id={id} onChange={onChange} className="input-select bg-white border-gray-200" disabled={disabled} value={value || ""}>
      <option value="">Sélectionner...</option>
      {options.map((opt: any) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
};

export default BaseSelect;

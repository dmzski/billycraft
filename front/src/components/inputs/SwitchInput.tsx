import React from "react";

const SwitchInput: React.FC<any> = ({ onToggle, checked, id }) => {
  const handleClick = (e: any) => {
    onToggle(e);
  };
  return (
    <div className="input-switch-container flex justify-center">
      <input type="checkbox" id={id} checked={checked || false} onChange={handleClick} />
      <label htmlFor={id}>Toggle</label>
    </div>
  );
};

export default SwitchInput;

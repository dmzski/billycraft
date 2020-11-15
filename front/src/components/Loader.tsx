import React from "react";

const Loader: React.FC<{ size?: "small" | "normal" | "big" }> = ({ size = "normal" }) => {
  return (
    <div className={"loader-balls " + size}>
      <div className={"loader-balls__item " + size}></div>
      <div className={"loader-balls__item " + size}></div>
      <div className={"loader-balls__item " + size}></div>
    </div>
  );
};

export default Loader;

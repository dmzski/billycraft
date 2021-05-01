import React from "react";

const Loader: React.FC<{ size?: "small" | "normal" | "big" }> = ({ size = "normal" }) => {
  return <div>Chargement</div>;
};

export default Loader;

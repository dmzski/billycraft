import React from "react";
import { BrowserRouter } from "react-router-dom";

import MainProvider from "./providers/MainProvider";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PrivateSwitch from "./containers/PrivateSwitch";

function App() {
  return (
    <BrowserRouter>
      <MainProvider>
        <PrivateSwitch />
      </MainProvider>
      <div className="wave-container">
        <div className="wave wave0"></div>
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
    </BrowserRouter>
  );
}

export default App;

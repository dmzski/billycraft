import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import MainProvider from "./providers/MainProvider";
import Modal from "react-modal";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PrivateSwitch from "./containers/PrivateSwitch";

Modal.setAppElement("#modal-container");

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
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;

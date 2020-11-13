import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";

// import "./styles/index.scss";
import { ROUTES } from "./routes";

import Dashboard from "./pages/Dashboard";
import Quote from "./pages/Quote";
import QuoteForm from "./pages/QuoteForm";
import Customer from "./pages/Customer";
import Settings from "./pages/Settings";
import MainProvider from "./providers/MainProvider";
import CustomerForm from "./pages/CustomerForm";
import Modal from "react-modal";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Onboarding from "./pages/Onboarding";
import BillPage from "./pages/Bill";
import PrivateSwitch from "./containers/PrivateSwitch";
import CustomModal from "./containers/modals/CustomModal";

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

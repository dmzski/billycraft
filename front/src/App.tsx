import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainProvider from "./providers/MainProvider";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PrivateSwitch from "./containers/PrivateSwitch";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <MainProvider>
        <PrivateSwitch />
      </MainProvider>
      <div
        style={{ zIndex: -1 }}
        className="bg-primary-700 origin-bottom-right transform -rotate-45 w-1/2 h-screen translate-y-1/2 -translate-x-1/4 fixed bottom-0 left-full"
      />
    </BrowserRouter>
  );
};

export default App;

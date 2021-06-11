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
        className="bg-primary-700 origin-bottom-right transform -rotate-45 h-72 w-72 translate-y-20 translate-x-52 fixed bottom-0 right-0 overflow-hidden"
      />
    </BrowserRouter>
  );
};

export default App;

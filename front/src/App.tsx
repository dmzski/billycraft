import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainProvider from "./providers/MainProvider";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PrivateSwitch from "./pages/PrivateSwitch";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <MainProvider>
        <PrivateSwitch />
      </MainProvider>
    </BrowserRouter>
  );
};

export default App;

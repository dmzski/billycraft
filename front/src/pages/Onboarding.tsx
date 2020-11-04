import React from "react";
import { useHistory } from "react-router-dom";
import MyCompagnyForm from "../containers/forms/MyCompagnyForm";

const Onboarding = () => {
  const [company, setCompany] = React.useState({});

  return (
    <div className="onboarding-background bg-gradient-to-t w-full h-full flex justify-center items-center">
      <div className=" bg-white flex items-center flex-col p-5 rounded-lg shadow-2xl">
        <div className="text-4xl pb-3">
          <h1>Bienvenue dans votre espace 🚀</h1>
        </div>

        <div className="text-gray-600">
          <p>Créer votre entreprise pour commencer à utiliser l'outil renseigner les informations concernant votre entreprise</p>
        </div>

        <div className="w-full mt-3">
          <MyCompagnyForm company={company} setCompany={setCompany} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

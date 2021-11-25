import Company from "models/Company";
import React from "react";
import MyCompagnyForm from "./Settings/Forms/MyCompagnyForm";

const Onboarding = (): JSX.Element => {
  const [company, setCompany] = React.useState<Company>({} as Company);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed from-primary-500 to-primary-300 bg-gradient-to-t inset-0" />
      <div className="z-10 bg-white flex items-center flex-col p-5 rounded-lg shadow-2xl">
        <div className="text-4xl pb-3">
          <h1>Bienvenue dans votre espace 🚀</h1>
        </div>

        <div className="text-gray-600">
          <p>
            Créer votre entreprise pour commencer à utiliser l&lsquo;outil
            renseigner les informations concernant votre entreprise
          </p>
        </div>

        <div className="w-full mt-3">
          <MyCompagnyForm company={company} setCompany={setCompany} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

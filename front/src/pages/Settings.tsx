import React from "react";
import { useQuery } from "react-query";
import BillCustomizationForm from "../containers/forms/BillCustomizationForm";
import MyCompagnyForm from "../containers/forms/MyCompagnyForm";
import QuoteCustomizationForm from "../containers/forms/QuoteCustomizationForm";
import QuoteEmailCustomizationForm from "../containers/forms/QuoteEmailCustomizationForm";
import Layout from "../containers/layout/Layout";
import BillTab from "../containers/settings/BillTab";
import QuoteTab from "../containers/settings/QuoteTab";
import { BillCustomizationGraphQL } from "../graphql/BillCustomizationGraphQL";
import { CompanyGraphQL } from "../graphql/CompanyGraphQL";
import { QuoteCustomizationGraphQL } from "../graphql/QuoteCustomizationGraphQL";
import { QuoteEmailCustomizationGraphQL } from "../graphql/QuoteEmailCustomizationGraphQL";
import { QuoteEmailCustomization } from "../models/QuoteEmailCustomization";
import { useToast } from "../providers/ToastProvider";

const Settings = () => {
  const [tab, setTab] = React.useState("company");
  const companyQuery = useQuery("my-company", CompanyGraphQL.getMyCompany, { enabled: tab === "company" });

  const [company, setCompany] = React.useState<any>({});

  const changeTab = (newTab: string) => (e: any) => {
    setTab(newTab);
  };

  React.useEffect(() => {
    if (companyQuery.data) {
      setCompany(companyQuery.data);
    }
  }, [companyQuery]);
  return (
    <div className="w-full">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex justify-center items-center w-full bg-white mb-3">
          <div
            onClick={changeTab("company")}
            className={"cursor-pointer hover:font-bold p-3 w-1/3 text-center border-b-4 " + (tab === "company" && "font-bold border-purple-600")}
          >
            Mon entreprise
          </div>
          <div
            onClick={changeTab("quote")}
            className={"cursor-pointer hover:font-bold p-3 w-1/3 text-center border-b-4 " + (tab === "quote" && "font-bold border-purple-600")}
          >
            Personnalisation des devis
          </div>
          <div
            onClick={changeTab("bill")}
            className={"cursor-pointer hover:font-bold p-3 w-1/3 text-center border-b-4 " + (tab === "bill" && "font-bold border-purple-600")}
          >
            Personnalisation des factures
          </div>
        </div>
        <div className="flex flex-col w-full justify-center items-center">
          {tab === "company" && (
            <>
              {companyQuery.data && (
                <div className="w-3/4 bg-white shadow-md rounded p-5">
                  <MyCompagnyForm company={company} setCompany={setCompany} />
                </div>
              )}
              {companyQuery.isLoading && <div>Chargement de l'entreprise...</div>}
              {companyQuery.isError && <div>Une erreur est survenue</div>}
            </>
          )}
          {tab === "quote" && <QuoteTab />}
          {tab === "bill" && <BillTab />}
        </div>
      </div>
    </div>
  );
};

export default Settings;

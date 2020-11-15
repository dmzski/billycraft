import React from "react";
import { useQuery } from "react-query";
import BillCustomizationForm from "../containers/forms/BillCustomizationForm";
import MyCompagnyForm from "../containers/forms/MyCompagnyForm";
import QuoteCustomizationForm from "../containers/forms/QuoteCustomizationForm";
import Layout from "../containers/layout/Layout";
import { BillCustomizationGraphQL } from "../graphql/BillCustomizationGraphQL";
import { CompanyGraphQL } from "../graphql/CompanyGraphQL";
import { QuoteCustomizationGraphQL } from "../graphql/QuoteCustomizationGraphQL";
import { useToast } from "../providers/ToastProvider";

const Settings = () => {
  const [tab, setTab] = React.useState("company");
  const companyQuery = useQuery("my-company", CompanyGraphQL.getMyCompany, { enabled: tab === "company" });
  const quoteCustomizationQuery = useQuery("quote-customization", QuoteCustomizationGraphQL.getMyInformation, {
    refetchOnWindowFocus: false,
    enabled: tab === "quote",
  });
  const billCustomizationQuery = useQuery("bill-customization", BillCustomizationGraphQL.getMyInformation, {
    refetchOnWindowFocus: false,
    enabled: tab === "bill",
  });
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
    <>
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
          {tab === "quote" && (
            <>
              {quoteCustomizationQuery.data && <QuoteCustomizationForm quoteCustomization={quoteCustomizationQuery.data} />}
              {quoteCustomizationQuery.isLoading && <div>Chargement de la personnalisation des devis</div>}
              {quoteCustomizationQuery.isError && <div>Une erreur est survenue</div>}
            </>
          )}
          {tab === "bill" && (
            <>
              {billCustomizationQuery.data && <BillCustomizationForm billCustomization={billCustomizationQuery.data} />}
              {billCustomizationQuery.isLoading && <div>Chargement de la personnalisation des factures</div>}
              {billCustomizationQuery.isError && <div>Une erreur est survenue</div>}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;

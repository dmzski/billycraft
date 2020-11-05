import React from "react";
import { useQuery } from "react-query";
import MyCompagnyForm from "../containers/forms/MyCompagnyForm";
import QuoteCustomizationForm from "../containers/forms/QuoteCustomizationForm";
import Layout from "../containers/layout/Layout";
import { CompanyGraphQL } from "../graphql/CompanyGraphQL";
import { QuoteCustomizationGraphQL } from "../graphql/QuoteCustomizationGraphQL";
import { useToast } from "../providers/ToastProvider";

const Settings = () => {
  const companyQuery = useQuery("my-company", CompanyGraphQL.getMyCompany);
  const quoteCustomizationQuery = useQuery("quote-customization", QuoteCustomizationGraphQL.getMyInformation, { refetchOnWindowFocus: false });
  const [company, setCompany] = React.useState<any>({});

  React.useEffect(() => {
    if (companyQuery.data) {
      setCompany(companyQuery.data);
    }
  }, [companyQuery]);
  return (
    <Layout>
      <div className="flex flex-col w-full justify-center items-center">
        {companyQuery.data && (
          <div className="w-3/4 bg-white shadow-md rounded p-5">
            <MyCompagnyForm company={company} setCompany={setCompany} />
          </div>
        )}
        {companyQuery.isLoading && <div>Chargement de l'entreprise...</div>}
        {companyQuery.isError && <div>Une erreur est survenue</div>}
        {quoteCustomizationQuery.data && <QuoteCustomizationForm quoteCustomization={quoteCustomizationQuery.data} />}
        {quoteCustomizationQuery.isLoading && <div>Chargement des informatiosn du devis</div>}
        {quoteCustomizationQuery.isError && <div>Une erreur est survenue</div>}
      </div>
    </Layout>
  );
};

export default Settings;

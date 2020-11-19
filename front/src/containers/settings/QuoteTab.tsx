import React from "react";
import { useMutation, useQuery } from "react-query";
import { QuoteCustomizationGraphQL } from "../../graphql/QuoteCustomizationGraphQL";
import { QuoteEmailCustomizationGraphQL } from "../../graphql/QuoteEmailCustomizationGraphQL";
import { useToast } from "../../providers/ToastProvider";
import QuoteCustomizationForm from "../forms/QuoteCustomizationForm";
import QuoteEmailCustomizationForm from "../forms/QuoteEmailCustomizationForm";

const QuoteTab = () => {
  const toast = useToast();
  const quoteCustomizationQuery = useQuery("quote-customization", QuoteCustomizationGraphQL.getMyInformation, {
    refetchOnWindowFocus: false,
  });
  const quoteEmailCustomizationQuery = useQuery("quote-email-customization", QuoteEmailCustomizationGraphQL.getMine, {
    refetchOnWindowFocus: false,
  });
  const [saveEmailCustomization, saveEmailCustomizationState] = useMutation(QuoteEmailCustomizationGraphQL.updateMyQuoteCustomization, {
    onSuccess: () => {
      quoteCustomizationQuery.refetch();
      toast.show({ message: "Modifications enregistrées", variant: "success" });
    },
  });

  const handleEmailCustomizationSubmit = async (e: any, quoteCustomization: any) => {
    e.preventDefault();
    try {
      if (!saveEmailCustomizationState.isLoading) {
        await saveEmailCustomization(quoteCustomization);
      }
    } catch (error) {
      toast.show({ message: "Une erreur est survenue", variant: "error" });
    }
  };

  return (
    <div className="w-full flex justify-center flex-col items-center">
      {quoteCustomizationQuery.data && (
        <div className="w-3/4 bg-white shadow-md rounded p-5">
          <QuoteCustomizationForm quoteCustomization={quoteCustomizationQuery.data} />
        </div>
      )}
      {quoteCustomizationQuery.isLoading && <div>Chargement de la personnalisation des devis</div>}
      {quoteCustomizationQuery.isError && <div>Une erreur est survenue</div>}
      {quoteEmailCustomizationQuery.data && (
        <div className="w-3/4 bg-white shadow-md rounded p-5 mt-3">
          <QuoteEmailCustomizationForm quoteEmailCustomization={quoteEmailCustomizationQuery.data} onSubmit={handleEmailCustomizationSubmit} />
        </div>
      )}
      {quoteEmailCustomizationQuery.isLoading && <div>Chargement de la personnalisation de l'email des devis</div>}
      {quoteEmailCustomizationQuery.isError && <div>Une erreur est survenue</div>}
    </div>
  );
};

export default QuoteTab;

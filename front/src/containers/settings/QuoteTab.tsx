import { Loader } from "@coco-ui/core";
import { QuoteCustomizationApi } from "api/QuoteCustomizationApi";
import { QuoteEmailCustomizationApi } from "api/QuoteEmailCustomizationApi";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../../providers/ToastProvider";
import QuoteCustomizationForm from "../forms/QuoteCustomizationForm";
import QuoteEmailCustomizationForm from "../forms/QuoteEmailCustomizationForm";

const QuoteTab = (): JSX.Element => {
  const toast = useToast();
  const quoteCustomizationQuery = useQuery(
    "quote-customization",
    QuoteCustomizationApi.findMine,
    {
      refetchOnWindowFocus: false,
    }
  );
  const quoteEmailCustomizationQuery = useQuery(
    "quote-email-customization",
    QuoteEmailCustomizationApi.findMine,
    {
      refetchOnWindowFocus: false,
    }
  );
  const [saveEmailCustomization, saveEmailCustomizationState] = useMutation(
    QuoteEmailCustomizationApi.updateMine,
    {
      onSuccess: () => {
        quoteCustomizationQuery.refetch();
        toast.show({
          message: "Modifications enregistrées",
          variant: "success",
        });
      },
    }
  );

  const handleEmailCustomizationSubmit = async (
    e: any,
    quoteCustomization: any
  ) => {
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
        <div className="w-3/4">
          <QuoteCustomizationForm
            quoteCustomization={quoteCustomizationQuery.data}
          />
        </div>
      )}
      {quoteCustomizationQuery.isLoading && (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      )}
      {quoteCustomizationQuery.isError && <div>Une erreur est survenue</div>}
      {quoteEmailCustomizationQuery.data && (
        <div className="w-3/4 mt-10">
          <QuoteEmailCustomizationForm
            quoteEmailCustomization={quoteEmailCustomizationQuery.data}
            onSubmit={handleEmailCustomizationSubmit}
          />
        </div>
      )}
      {quoteEmailCustomizationQuery.isLoading && (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      )}
      {quoteEmailCustomizationQuery.isError && (
        <div>Une erreur est survenue</div>
      )}
    </div>
  );
};

export default QuoteTab;

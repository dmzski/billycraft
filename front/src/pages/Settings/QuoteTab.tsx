import { Loader } from "@coco-ui/core";
import React from "react";
import { QuoteCustomizationApi } from "api/QuoteCustomizationApi";
import { QuoteEmailCustomizationApi } from "api/QuoteEmailCustomizationApi";
import { useMutation, useQuery } from "react-query";
import { useToast } from "providers/ToastProvider";
import QuoteCustomizationForm from "./Forms/QuoteCustomizationForm";
import QuoteEmailCustomizationForm from "./Forms/QuoteEmailCustomizationForm";

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
        <div className="w-full">
          <QuoteCustomizationForm
            quoteCustomization={quoteCustomizationQuery.data}
          />
        </div>
      )}
      {quoteCustomizationQuery.isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader />
        </div>
      )}
      {quoteCustomizationQuery.isError && <div>Une erreur est survenue</div>}
      {quoteEmailCustomizationQuery.data && (
        <div className="w-full mt-12 border-t pt-12">
          <QuoteEmailCustomizationForm
            quoteEmailCustomization={quoteEmailCustomizationQuery.data}
            onSubmit={handleEmailCustomizationSubmit}
          />
        </div>
      )}
      {quoteEmailCustomizationQuery.isLoading && (
        <div className="mt-4 flex justify-center">
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

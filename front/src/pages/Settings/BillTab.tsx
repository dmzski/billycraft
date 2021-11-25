import { Loader } from "@coco-ui/core";
import React from "react";
import { BillCustomizationApi } from "api/BillCustomizationApi";
import { BillEmailCustomizationApi } from "api/BillEmailCustomizationApi";
import { useMutation, useQuery } from "react-query";
import { useToast } from "providers/ToastProvider";
import BillCustomizationForm from "./Forms/BillCustomizationForm";
import BillEmailCustomizationForm from "./Forms/BillEmailCustomizationForm";

const BillTab = (): JSX.Element => {
  const toast = useToast();
  const billCustomizationQuery = useQuery(
    "bill-customization",
    BillCustomizationApi.findMine,
    {
      refetchOnWindowFocus: false,
    }
  );

  const billEmailCustomizationQuery = useQuery(
    "bill-email-customization",
    BillEmailCustomizationApi.findMine,
    {
      refetchOnWindowFocus: false,
    }
  );
  const [saveEmailCustomization, saveEmailCustomizationState] = useMutation(
    BillEmailCustomizationApi.updateMine,
    {
      onSuccess: () => {
        billEmailCustomizationQuery.refetch();
        toast.show({
          message: "Modifications enregistrées",
          variant: "success",
        });
      },
      throwOnError: true,
    }
  );

  const handleEmailCustomizationSubmit = async (
    e: any,
    billEmailCustomization: any
  ) => {
    e.preventDefault();
    try {
      if (!saveEmailCustomizationState.isLoading) {
        await saveEmailCustomization(billEmailCustomization);
      }
    } catch (error) {
      toast.show({ message: "Une erreur est survenue", variant: "error" });
    }
  };

  return (
    <div className="w-full">
      {billCustomizationQuery.data && (
        <div>
          <BillCustomizationForm
            billCustomization={billCustomizationQuery.data}
          />
        </div>
      )}
      {billCustomizationQuery.isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader />
        </div>
      )}
      {billCustomizationQuery.isError && <div>Une erreur est survenue</div>}

      {billEmailCustomizationQuery.isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader />
        </div>
      )}
      {billEmailCustomizationQuery.isError && (
        <div>
          Une erreur est survenue lors du chargement de la personnalisation des
          emails
        </div>
      )}
      {billEmailCustomizationQuery.data && (
        <div className="mt-12 border-t pt-12">
          <BillEmailCustomizationForm
            billEmailCustomization={billEmailCustomizationQuery.data}
            onSubmit={handleEmailCustomizationSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default BillTab;

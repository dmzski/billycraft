import { Loader } from "@coco-ui/core";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { BillCustomizationGraphQL } from "../../graphql/BillCustomizationGraphQL";
import { BillEmailCustomizationGraphQL } from "../../graphql/BillEmailCustomizationGraphQL";
import { useToast } from "../../providers/ToastProvider";
import BillCustomizationForm from "../forms/BillCustomizationForm";
import BillEmailCustomizationForm from "../forms/BillEmailCustomizationForm";

const BillTab = (): JSX.Element => {
  const toast = useToast();
  const billCustomizationQuery = useQuery("bill-customization", BillCustomizationGraphQL.getMyInformation, {
    refetchOnWindowFocus: false,
  });

  const billEmailCustomizationQuery = useQuery("bill-email-customization", BillEmailCustomizationGraphQL.getMine, {
    refetchOnWindowFocus: false,
  });
  const [saveEmailCustomization, saveEmailCustomizationState] = useMutation(BillEmailCustomizationGraphQL.updateMyBillCustomization, {
    onSuccess: () => {
      billEmailCustomizationQuery.refetch();
      toast.show({ message: "Modifications enregistrées", variant: "success" });
    },
    throwOnError: true,
  });

  const handleEmailCustomizationSubmit = async (e: any, billEmailCustomization: any) => {
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
    <div className="w-3/4">
      {billCustomizationQuery.data && (
        <div>
          <BillCustomizationForm billCustomization={billCustomizationQuery.data} />
        </div>
      )}
      {billCustomizationQuery.isLoading && (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      )}
      {billCustomizationQuery.isError && <div>Une erreur est survenue</div>}

      {billEmailCustomizationQuery.isLoading && (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      )}
      {billEmailCustomizationQuery.isError && <div>Une erreur est survenue lors du chargement de la personnalisation des emails</div>}
      {billEmailCustomizationQuery.data && (
        <div className="mt-10">
          <BillEmailCustomizationForm billEmailCustomization={billEmailCustomizationQuery.data} onSubmit={handleEmailCustomizationSubmit} />
        </div>
      )}
    </div>
  );
};

export default BillTab;

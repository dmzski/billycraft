import { Button, Modal } from "@coco-ui/core";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { PdfApi } from "../../api/PdfApi";
import { BillGraphQL } from "../../graphql/BillGraphQL";
import useLoadingState from "../../hooks/useLoadingState";
import { Bill } from "../../models/Bill";
import { BillStatusEnum } from "../../models/BillStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import BillForm from "../forms/BillForm";

const BillModal = ({ isOpen, onRequestClose, bill }: any): JSX.Element => {
  const [newBill, setNewBill] = React.useState<Bill>(new Bill());
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();

  const [createOrUpdateBillMutation, createOrUpdateBillMutationState] = useMutation(BillGraphQL.createOrUpdateBill, {
    onSuccess: (data) => {
      const tmp = [...(queryCache.getQueryData<Bill[]>("bills") ?? [])];
      if (data.updateBill) {
        const index = tmp.findIndex((b) => b.id === data.updateBill.id);
        if (index > -1) {
          tmp[index] = data.updateBill;
          setNewBill({ ...data.updateBill });
          queryCache.setQueryData("bills", tmp);
        }
      } else if (data.createBill) {
        tmp.push(data.createBill);
        queryCache.setQueryData("bills", tmp);
        setNewBill({ ...data.createBill });
      } else {
        onRequestClose();
      }
      toast.show({ message: "Enregistrement effectué", variant: "success" });
    },
  });

  const [updateBillStatusMutation, updateBillStatusMutationState] = useMutation(BillGraphQL.updateBillStatus, {
    onSuccess: () => {
      onRequestClose();
      toast.show({ message: "Facture mise à jour", variant: "success" });
    },
  });

  async function saveBill(e: any) {
    e.preventDefault();
    if (updateBillStatusMutationState.isLoading || createOrUpdateBillMutationState.isLoading) {
      return false;
    }
    try {
      await createOrUpdateBillMutation(newBill);
      queryCache.invalidateQueries("bills");
    } catch (error) {
      console.error("Error !!!", error);
    }
  }

  const updateBillStatus = (status: BillStatusEnum) => async () => {
    if (updateBillStatusMutationState.isLoading || createOrUpdateBillMutationState.isLoading) {
      return false;
    }
    try {
      await updateBillStatusMutation({ id: bill.id, statusEnum: status });
      queryCache.invalidateQueries("bills");
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  const downloadPdf = async () => {
    try {
      if (pdfState.isIdle && newBill.id) {
        pdfState.update("loading");
        const html = await PdfApi.getBillPdf(newBill.id);
        const url = URL.createObjectURL(new Blob([html], { type: "application/pdf" }));
        window.open(url, "_blank");
        pdfState.update("idle");
      }
    } catch (e) {
      console.log("Error when downlaod pdf", e);
      toast.show({ message: "Erreur lors de la génération du PDF", variant: "error" });
      setTimeout(() => {
        pdfState.update("idle");
      }, 1000);
    }
  };

  React.useEffect(() => {
    setNewBill(bill ? bill : new Bill());
  }, [bill, isOpen]);

  return (
    <Modal open={isOpen} onClose={onRequestClose} size="xl">
      <div className="flex flex-col w-full">
        <div className="flex items-center mb-4  border-b-2 border-gray-400">
          <h1 className="ml-4 text-2xl flex-grow">{!newBill.id ? "Nouvelle " : "Modifier une "}facture</h1>
          {newBill && newBill.id && (
            <Button
              disabled={pdfState.isLoading}
              title="Télécharger le PDF"
              onClick={downloadPdf}
              variant="primary"
              className="mb-1"
              size="sm"
              icon="document-download"
            >
              PDF
            </Button>
          )}
        </div>
        <BillForm
          onSubmit={saveBill}
          bill={newBill}
          setBill={setNewBill}
          disabled={createOrUpdateBillMutationState.isLoading || updateBillStatusMutationState.isLoading}
          onUpdateStatus={updateBillStatus}
        />
      </div>
    </Modal>
  );
};

export default BillModal;

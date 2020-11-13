import React from "react";
import Modal from "react-modal";
import { useMutation, useQueryCache } from "react-query";
import { PdfApi } from "../../api/PdfApi";
import { BillGraphQL } from "../../graphql/BillGraphQL";
import useLoadingState from "../../hooks/useLoadingState";
import { Bill } from "../../models/Bill";
import { BillStatusEnum } from "../../models/BillStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import BillForm from "../forms/BillForm";
import CustomModal from "./CustomModal";

const BillModal: React.FC<any> = ({ isOpen, onRequestClose, bill }) => {
  const [newBill, setNewBill] = React.useState<Bill>(new Bill());
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();

  function goBack(e: any) {
    onRequestClose();
  }

  const [createOrUpdateBillMutation, createOrUpdateBillMutationState] = useMutation(BillGraphQL.createOrUpdateBill, {
    onSuccess: () => {
      onRequestClose();
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

  const updateBillStatus = (status: BillStatusEnum) => async (e: any) => {
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
      if (pdfState.isIdle) {
        pdfState.update("loading");
        const html = await PdfApi.getBillPdf(bill.id);
        window.open(URL.createObjectURL(new Blob([html], { type: "application/pdf" })), "_blank");
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
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { width: "80%" } }}>
      <div className="flex items-center mb-4  border-b-2 border-gray-400">
        <h1 className="ml-4 text-2xl flex-grow">{!newBill.id ? "Nouvelle " : "Modifier une "}facture</h1>
        {bill && bill.id && (
          <button className="button primary mb-2" onClick={downloadPdf} title="Télécharger le PDF" disabled={pdfState.isLoading}>
            <span className="material-icons mr-3">picture_as_pdf</span> PDF
          </button>
        )}
      </div>
      <BillForm
        onSubmit={saveBill}
        bill={newBill}
        setBill={setNewBill}
        disabled={createOrUpdateBillMutationState.isLoading || updateBillStatusMutationState.isLoading}
        onUpdateStatus={updateBillStatus}
      />
    </CustomModal>
  );
};

export default BillModal;

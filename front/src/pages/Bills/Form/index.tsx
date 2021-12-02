import { Badge, Button } from "@coco-ui/core";
import React from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { PdfApi } from "../../../api/PdfApi";
import useLoadingState from "../../../hooks/useLoadingState";
import Bill, { BillStatusEnum } from "../../../models/Bill";
import { useToast } from "../../../providers/ToastProvider";
import { ROUTES } from "../../../routes";
import BillForm from "./Form";
import { BillApi } from "api/BillApi";
import { BILL_STATUS } from "constants/bill";

const BillFormPage = (): JSX.Element => {
  const [newBill, setNewBill] = React.useState<Bill>({} as Bill);
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data: bill, refetch } = useQuery(
    `bill-${id}`,
    () => BillApi.findById(id),
    {
      enabled: id !== "new",
    }
  );

  const [
    createOrUpdateBillMutation,
    createOrUpdateBillMutationState,
  ] = useMutation(BillApi.createOrUpdate, {
    onSuccess: (data) => {
      if (data.id !== id) {
        history.push(ROUTES.QUOTE_FORM.path.replace(":id", data.id));
      } else {
        refetch();
      }
    },
    throwOnError: true,
  });

  const [updateBillStatusMutation, updateBillStatusMutationState] = useMutation(
    BillApi.updateStatus,
    {
      onSuccess: () => {
        history.push(ROUTES.BILLS.path);
        toast.show({ message: "Facture mise à jour", variant: "success" });
      },
    }
  );

  async function saveBill(e: any) {
    e.preventDefault();
    if (
      updateBillStatusMutationState.isLoading ||
      createOrUpdateBillMutationState.isLoading
    ) {
      return false;
    }
    try {
      await createOrUpdateBillMutation({
        ...newBill,
        lines: newBill.lines.map((line, index) => ({ ...line, line: index })),
      });
      queryCache.invalidateQueries("bills");
      refetch();
      toast.show({
        message: "Devis enregistré",
        variant: "success",
      });
    } catch (error) {
      toast.show({
        message: "Erreur lors de l'enregistrement",
        variant: "error",
      });
      console.error("Error !!!", error);
    }
  }

  const updateBillStatus = (status: BillStatusEnum) => async () => {
    if (
      updateBillStatusMutationState.isLoading ||
      createOrUpdateBillMutationState.isLoading
    ) {
      return false;
    }
    try {
      await updateBillStatusMutation({ id, status });
      queryCache.invalidateQueries("bills");
      refetch();
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  const downloadPdf = async () => {
    try {
      if (pdfState.isIdle && bill?.id) {
        pdfState.update("loading");
        const blob = await PdfApi.getBillPdf(bill.id);
        const link = document.createElement("a");
        link.download = bill.id ?? "unknown.pdf";
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        pdfState.update("idle");
      }
    } catch (e) {
      console.error("Error when downlaod pdf", e);
      toast.show({
        message: "Erreur lors de la génération du PDF",
        variant: "error",
      });
      setTimeout(() => {
        pdfState.update("idle");
      }, 1000);
    }
  };

  React.useEffect(() => {
    setNewBill(bill && id !== "new" ? bill : ({} as Bill));
  }, [bill]);

  return (
    <div className="w-full">
      <Button
        variant="inverted-primary"
        className="mb-4"
        size="xs"
        onClick={history.goBack}
      >
        Retourner à la liste des factures
      </Button>
      <div className="flex items-center mb-8 border-b">
        <div className="flex items-end flex-grow">
          <h1 className="text-3xl">
            {!newBill.id ? "Nouvelle facture" : "Modifier une facture"}
          </h1>
          <Badge variant="outline" className="text-xs ml-2 my-2 px-2">
            {BILL_STATUS[newBill.status as keyof typeof BILL_STATUS]?.text}
          </Badge>
        </div>
        {newBill && newBill.id ? (
          <Button
            disabled={pdfState.isLoading}
            title="Télécharger le PDF"
            onClick={downloadPdf}
            variant="primary"
            className="mb-1"
            size="sm"
            icon="document-download"
          >
            Télécharger le PDF
          </Button>
        ) : null}
      </div>
      <BillForm
        onSubmit={saveBill}
        bill={newBill}
        setBill={setNewBill}
        disabled={
          createOrUpdateBillMutationState.isLoading ||
          updateBillStatusMutationState.isLoading
        }
        onUpdateStatus={updateBillStatus}
      />
    </div>
  );
};

export default BillFormPage;

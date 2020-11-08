import React from "react";
import Modal from "react-modal";
import { useMutation, useQueryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { PdfApi } from "../../api/PdfApi";
import { BillGraphQL } from "../../graphql/BillGraphQL";
import { QuoteGraphQL } from "../../graphql/QuoteGraphQL";
import useLoadingState from "../../hooks/useLoadingState";
import { Quote } from "../../models/Quote";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import { ROUTES } from "../../routes";
import QuoteForm from "../forms/QuoteForm";

const QuoteModal: React.FC<any> = ({ isOpen, onRequestClose, quote }) => {
  const [newQuote, setNewQuote] = React.useState<Quote>(new Quote());
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();
  const history = useHistory();

  function goBack(e: any) {
    onRequestClose();
  }

  const [createOrUpdateQuoteMutation, createOrUpdateQuoteMutationState] = useMutation(QuoteGraphQL.createOrUpdateQuote, {
    onSuccess: () => {
      onRequestClose();
      toast.show({ message: "Enregistrement effectué", variant: "success" });
    },
  });
  const [createBillFormQuoteMutation, createBillFormQuoteMutationState] = useMutation(BillGraphQL.createFromQuote, {
    onSuccess: () => {
      onRequestClose();
      history.push(ROUTES.BILLS.path);
      toast.show({ message: "Facture créé", variant: "success" });
    },
  });

  const [updateQuoteStatusMutation, updateQuoteStatusMutationState] = useMutation(QuoteGraphQL.updateQuoteStatus, {
    onSuccess: () => {
      onRequestClose();
      toast.show({ message: "Devis mis à jour", variant: "success" });
    },
  });

  async function saveQuote(e: any) {
    e.preventDefault();
    if (updateQuoteStatusMutationState.isLoading || createOrUpdateQuoteMutationState.isLoading) {
      return false;
    }
    try {
      await createOrUpdateQuoteMutation(newQuote);
      queryCache.invalidateQueries("quotes");
    } catch (error) {
      console.error("Error !!!", error);
    }
  }

  const updateQuoteStatus = (status: QuoteStatusEnum) => async (e: any) => {
    if (updateQuoteStatusMutationState.isLoading || createOrUpdateQuoteMutationState.isLoading) {
      return false;
    }
    try {
      await updateQuoteStatusMutation({ id: quote.id, statusEnum: status });
      queryCache.invalidateQueries("quotes");
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  const downloadPdf = async () => {
    try {
      if (pdfState.isIdle) {
        pdfState.update("loading");
        const html = await PdfApi.getQuotePdf(quote.id);
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

  const createBillFromQuote = async (e: any) => {
    try {
      if (!createBillFormQuoteMutationState.isLoading && quote.id) {
        const result = createBillFormQuoteMutation(quote.id);
        queryCache.invalidateQueries("bills");
      }
    } catch (error) {
      console.log("Une erreur est survenue", error);
      toast.show({ message: "Erreur lors de la génération de la facture", variant: "error" });
    }
  };

  React.useEffect(() => {
    setNewQuote(quote ? quote : new Quote());
  }, [quote, isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="modal-overlay" style={{ content: { minWidth: "80%" } }}>
      <div className="flex items-center mb-4  border-b-2 border-gray-400">
        <h1 className="ml-4 text-2xl flex-grow">{!newQuote.id ? "Nouveau " : "Modifier un "}devis</h1>
        {quote && quote.status === QuoteStatusEnum.ACCEPTED && quote.id && (
          <button className="button primary mb-2" onClick={createBillFromQuote} title="Créer la facture" disabled={createBillFormQuoteMutationState.isLoading}>
            <span className="material-icons mr-3">payment</span> Créer la facture
          </button>
        )}
        {quote && quote.id && (
          <button className="button primary mb-2" onClick={downloadPdf} title="Télécharger le PDF" disabled={pdfState.isLoading}>
            <span className="material-icons mr-3">picture_as_pdf</span> PDF
          </button>
        )}
      </div>
      <QuoteForm
        onSubmit={saveQuote}
        quote={newQuote}
        setQuote={setNewQuote}
        disabled={createOrUpdateQuoteMutationState.isLoading || updateQuoteStatusMutationState.isLoading}
        onUpdateStatus={updateQuoteStatus}
      />
    </Modal>
  );
};

export default QuoteModal;

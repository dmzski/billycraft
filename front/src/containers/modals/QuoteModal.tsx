import React from "react";
import Modal from "react-modal";
import { useMutation, useQueryCache } from "react-query";
import { PdfApi } from "../../api/PdfApi";
import { QuoteGraphQL } from "../../graphql/QuoteGraphQL";
import { Quote } from "../../models/Quote";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import QuoteForm from "../forms/QuoteForm";

const QuoteModal: React.FC<any> = ({ isOpen, onRequestClose, quote }) => {
  const [newQuote, setNewQuote] = React.useState<Quote>(new Quote());
  const queryCache = useQueryCache();
  const toast = useToast();

  function goBack(e: any) {
    onRequestClose();
  }

  const [createOrUpdateQuoteMutation, createOrUpdateQuoteMutationState] = useMutation(QuoteGraphQL.createOrUpdateQuote, {
    onSuccess: () => {
      onRequestClose();
      toast.show({ message: "Enregistrement effectué", variant: "success" });
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
      const html = await PdfApi.getPdf(quote.id);
      window.open(URL.createObjectURL(new Blob([html], { type: "application/pdf" })), "_blank");
    } catch (e) {
      console.log("Error when downlaod pdf", e);
    }
  };

  React.useEffect(() => {
    setNewQuote(quote ? quote : new Quote());
  }, [quote, isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="modal-overlay" style={{ content: { minWidth: "80%" } }}>
      <div className="flex items-center mb-4  border-b-2 border-gray-400">
        <h1 className="ml-4 text-2xl flex-grow">{!newQuote.id ? "Nouveau " : "Modifier un "}devis</h1>
        {quote && quote.id && quote.status !== QuoteStatusEnum.DRAFT && (
          <button className="primary material-icons" onClick={downloadPdf} title="Télécharger le PDF">
            picture_as_pdf
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

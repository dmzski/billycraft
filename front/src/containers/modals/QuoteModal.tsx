import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { EmailApi } from "../../api/EmailApi";
import { PdfApi } from "../../api/PdfApi";
import { BillGraphQL } from "../../graphql/BillGraphQL";
import { QuoteGraphQL } from "../../graphql/QuoteGraphQL";
import useLoadingState from "../../hooks/useLoadingState";
import { Quote } from "../../models/Quote";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import { ROUTES } from "../../routes";
import QuoteForm from "../forms/QuoteForm";
import CustomModal from "./CustomModal";

const QuoteModal: React.FC<any> = ({ isOpen, onRequestClose, quote }) => {
  const [newQuote, setNewQuote] = React.useState<Quote>(new Quote());
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();
  const history = useHistory();

  const [createOrUpdateQuoteMutation, createOrUpdateQuoteMutationState] = useMutation(QuoteGraphQL.createOrUpdateQuote, {
    onSuccess: (data) => {
      const tmp = [...queryCache.getQueryData<Quote[]>("quotes")!];
      if (data.updateQuote) {
        const index = tmp.findIndex((q) => q.id === data.updateQuote.id);
        if (index > -1) {
          tmp[index] = data.updateQuote;
          setNewQuote({ ...data.updateQuote });
          queryCache.setQueryData("quotes", tmp);
        }
      } else if (data.createQuote) {
        tmp.push(data.createQuote);
        queryCache.setQueryData("quotes", tmp);
        setNewQuote({ ...data.createQuote });
      } else {
        onRequestClose();
      }
      toast.show({ message: "Enregistrement effectué", variant: "success" });
    },
    throwOnError: true,
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
  const [sendMailMutation, sendMailMutationState] = useMutation(EmailApi.sendQuote, {
    onSuccess: () => {
      toast.show({ message: "Email envoyé", variant: "success" });
    },
    throwOnError: true,
  });

  async function saveQuote(e: any) {
    e.preventDefault();
    if (updateQuoteStatusMutationState.isLoading || createOrUpdateQuoteMutationState.isLoading) {
      return false;
    }
    try {
      await createOrUpdateQuoteMutation(newQuote);
    } catch (error) {
      toast.show({ message: "Erreur lors de l'enregistrement", variant: "error" });
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
      if (pdfState.isIdle && newQuote.id) {
        pdfState.update("loading");
        const html = await PdfApi.getQuotePdf(newQuote.id);
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

  const sendMail = async () => {
    try {
      if (!sendMailMutationState.isLoading && quote.id) {
        await sendMailMutation(quote.id);
      }
    } catch (e) {
      console.log("Error when send email pdf", e);
      toast.show({ message: "Erreur lors de l'envoi de l'email", variant: "error" });
    }
  };

  const createBillFromQuote = async (e: any) => {
    try {
      if (!createBillFormQuoteMutationState.isLoading && quote.id) {
        createBillFormQuoteMutation(quote.id);
        queryCache.invalidateQueries("bills");
      }
    } catch (error) {
      console.log("Une erreur est survenue", error);
      toast.show({ message: "Erreur lors de la génération de la facture", variant: "error" });
    }
  };

  const isQuoteMinimumAccepted = () => {
    return [QuoteStatusEnum.ACCEPTED, QuoteStatusEnum.DEPOSIT_ASK, QuoteStatusEnum.DEPOSIT_PAID].includes(newQuote.status);
  };
  React.useEffect(() => {
    setNewQuote(quote ? quote : new Quote());
  }, [quote, isOpen]);

  return (
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { width: "80%" } }}>
      <div className="flex items-center mb-4  border-b-2 border-gray-400">
        <h1 className="ml-4 text-2xl flex-grow">{!newQuote.id ? "Nouveau " : "Modifier un "}devis</h1>
        {newQuote && newQuote.status === QuoteStatusEnum.SENT && newQuote.id && (
          <button className="button info mb-2 mr-3" onClick={sendMail} title="Envoyer par mail" disabled={sendMailMutationState.isLoading}>
            <span className="material-icons mr-3">email</span> Envoyer le mail
          </button>
        )}
        {newQuote && isQuoteMinimumAccepted() && newQuote.id && (
          <button
            className="button success mb-2 mr-3"
            onClick={createBillFromQuote}
            title="Créer la facture"
            disabled={createBillFormQuoteMutationState.isLoading}
          >
            <span className="material-icons mr-3">payment</span> Créer la facture
          </button>
        )}
        {newQuote && newQuote.id && (
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
    </CustomModal>
  );
};

export default QuoteModal;

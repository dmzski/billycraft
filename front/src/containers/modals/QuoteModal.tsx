import { Button, Modal } from "@coco-ui/core";
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

const QuoteModal = ({ isOpen, onRequestClose, quote }: any): JSX.Element => {
  const [newQuote, setNewQuote] = React.useState<Quote>(new Quote());
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();
  const history = useHistory();

  const [createOrUpdateQuoteMutation, createOrUpdateQuoteMutationState] = useMutation(QuoteGraphQL.createOrUpdateQuote, {
    onSuccess: (data) => {
      const tmp = [...(queryCache.getQueryData<Quote[]>("quotes") ?? [])];
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
      console.log(newQuote);
      await createOrUpdateQuoteMutation(newQuote);
    } catch (error) {
      toast.show({ message: "Erreur lors de l'enregistrement", variant: "error" });
      console.error("Error !!!", error);
    }
  }

  const updateQuoteStatus = (status: QuoteStatusEnum) => async () => {
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

  const createBillFromQuote = async () => {
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
    <Modal open={isOpen} onClose={onRequestClose} size="xl">
      <div className="flex-col w-full">
        <div className="flex items-center mb-4 border-b-2 border-gray-400">
          <h1 className="ml-4 text-2xl flex-grow">{!newQuote.id ? "Nouveau " : "Modifier un "}devis</h1>
          {newQuote && newQuote.status === QuoteStatusEnum.SENT && newQuote.id && (
            <Button
              className="mb-1 mr-1"
              variant="info"
              icon="mail"
              size="sm"
              onClick={sendMail}
              title="Envoyer par mail"
              disabled={sendMailMutationState.isLoading}
            >
              Envoyer le mail
            </Button>
          )}
          {newQuote && isQuoteMinimumAccepted() && newQuote.id && (
            <Button
              variant="success"
              size="sm"
              className="mb-1 mr-3"
              onClick={createBillFromQuote}
              title="Créer la facture"
              disabled={createBillFormQuoteMutationState.isLoading}
              icon="document-add"
            >
              Créer la facture
            </Button>
          )}
          {newQuote && newQuote.id && (
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
        <QuoteForm
          onSubmit={saveQuote}
          quote={newQuote}
          setQuote={setNewQuote}
          disabled={createOrUpdateQuoteMutationState.isLoading || updateQuoteStatusMutationState.isLoading}
          onUpdateStatus={updateQuoteStatus}
        />
      </div>
    </Modal>
  );
};

export default QuoteModal;

import { Button } from "@coco-ui/core";
import React from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { EmailApi } from "../../../api/EmailApi";
import { PdfApi } from "../../../api/PdfApi";
import useLoadingState from "../../../hooks/useLoadingState";
import Quote, { QuoteStatusEnum } from "../../../models/Quote";
import { useToast } from "../../../providers/ToastProvider";
import { ROUTES } from "../../../routes";
import QuoteForm from "./Form";
import { BillApi } from "api/BillApi";
import { QuoteApi } from "api/QuoteApi";

const QuoteCreationPage = (): JSX.Element => {
  const [newQuote, setNewQuote] = React.useState<Quote>({} as Quote);
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data: quote } = useQuery(`quote-${id}`, () => QuoteApi.findById(id), {
    enabled: id !== "new",
    refetchOnWindowFocus: false,
  });

  const [
    createOrUpdateQuoteMutation,
    createOrUpdateQuoteMutationState,
  ] = useMutation(QuoteApi.createOrUpdate, {
    onSuccess: (data) => {
      const tmp = [...(queryCache.getQueryData<Quote[]>("quotes") ?? [])];
      if (data) {
        const index = tmp.findIndex((q) => q.id === data.id);
        if (index > -1) {
          tmp[index] = data;
        } else {
          tmp.push(data);
        }
        setNewQuote({ ...data });
        queryCache.setQueryData("quotes", tmp);
      } else {
        history.push(ROUTES.QUOTES.path);
      }
      toast.show({ message: "Enregistrement effectué", variant: "success" });
    },
    throwOnError: true,
  });
  const [
    createBillFormQuoteMutation,
    createBillFormQuoteMutationState,
  ] = useMutation(BillApi.createFromQuote, {
    onSuccess: () => {
      history.push(ROUTES.QUOTES.path);
      history.push(ROUTES.BILLS.path);
      toast.show({ message: "Facture créé", variant: "success" });
    },
  });
  const [
    updateQuoteStatusMutation,
    updateQuoteStatusMutationState,
  ] = useMutation(QuoteApi.updateStatus, {
    onSuccess: () => {
      history.push(ROUTES.QUOTES.path);
      toast.show({ message: "Devis mis à jour", variant: "success" });
    },
  });
  const [sendMailMutation, sendMailMutationState] = useMutation(
    EmailApi.sendQuote,
    {
      onSuccess: () => {
        toast.show({ message: "Email envoyé", variant: "success" });
      },
      throwOnError: true,
    }
  );

  async function saveQuote(e: any) {
    e.preventDefault();
    if (
      updateQuoteStatusMutationState.isLoading ||
      createOrUpdateQuoteMutationState.isLoading
    ) {
      return false;
    }
    try {
      await createOrUpdateQuoteMutation({
        ...newQuote,
        lines: newQuote.lines.map((line, index) => ({
          ...line,
          line: index + 1,
        })),
      });
    } catch (error) {
      toast.show({
        message: "Erreur lors de l'enregistrement",
        variant: "error",
      });
      console.error("Error !!!", error);
    }
  }

  const updateQuoteStatus = (status: QuoteStatusEnum) => async () => {
    if (
      updateQuoteStatusMutationState.isLoading ||
      createOrUpdateQuoteMutationState.isLoading
    ) {
      return false;
    }
    try {
      await updateQuoteStatusMutation({ id, status });
      queryCache.invalidateQueries("quotes");
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  const downloadPdf = async () => {
    try {
      if (pdfState.isIdle && newQuote.id) {
        pdfState.update("loading");
        const blob = await PdfApi.getQuotePdf(newQuote.id);
        const link = document.createElement("a");
        link.download = quote?.id ?? "unknown.pdf";
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

  const sendMail = async () => {
    try {
      if (!sendMailMutationState.isLoading && id) {
        await sendMailMutation(id);
      }
    } catch (e) {
      console.error("Error when send email pdf", e);
      toast.show({
        message: "Erreur lors de l'envoi de l'email",
        variant: "error",
      });
    }
  };

  const createBillFromQuote = React.useCallback(async () => {
    try {
      if (!createBillFormQuoteMutationState.isLoading && id) {
        createBillFormQuoteMutation(id);
        queryCache.invalidateQueries("bills");
      }
    } catch (error) {
      console.error("Une erreur est survenue", error);
      toast.show({
        message: "Erreur lors de la génération de la facture",
        variant: "error",
      });
    }
  }, [
    id,
    toast,
    queryCache,
    createBillFormQuoteMutationState,
    createBillFormQuoteMutation,
  ]);

  const isQuoteMinimumAccepted = React.useCallback(() => {
    return [
      QuoteStatusEnum.ACCEPTED,
      QuoteStatusEnum.DEPOSIT_ASK,
      QuoteStatusEnum.DEPOSIT_PAID,
    ].includes(newQuote.status);
  }, [newQuote]);

  React.useEffect(() => {
    setNewQuote(quote && id !== "new" ? quote : ({} as Quote));
  }, [quote]);

  return (
    <div className="w-full px-4">
      <Button
        variant="inverted-primary"
        className="mb-4"
        size="xs"
        onClick={history.goBack}
      >
        Retourner à la liste des devis
      </Button>
      <div className="flex items-center mb-8 border-b">
        <h1 className="text-3xl flex-grow">
          {!newQuote.id ? "Nouveau " : "Modifier un "}devis
        </h1>
        {newQuote?.id && newQuote.status === QuoteStatusEnum.SENT ? (
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
        ) : null}
        {newQuote?.id && isQuoteMinimumAccepted() ? (
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
        ) : null}
        {newQuote?.id ? (
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
        ) : null}
      </div>
      <QuoteForm
        onSubmit={saveQuote}
        quote={newQuote}
        setQuote={setNewQuote}
        disabled={
          createOrUpdateQuoteMutationState.isLoading ||
          updateQuoteStatusMutationState.isLoading
        }
        onUpdateStatus={updateQuoteStatus}
      />
    </div>
  );
};

export default QuoteCreationPage;

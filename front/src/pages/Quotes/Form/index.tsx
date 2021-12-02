import { Button } from "@coco-ui/core";
import React from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { PdfApi } from "../../../api/PdfApi";
import useLoadingState from "../../../hooks/useLoadingState";
import Quote, { QuoteStatusEnum } from "../../../models/Quote";
import { useToast } from "../../../providers/ToastProvider";
import { ROUTES } from "../../../routes";
import QuoteForm from "./Form";
import { QuoteApi } from "api/QuoteApi";

const QuoteCreationPage = (): JSX.Element => {
  const [newQuote, setNewQuote] = React.useState<Quote>({} as Quote);
  const queryCache = useQueryCache();
  const toast = useToast();
  const pdfState = useLoadingState();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data: quote, refetch } = useQuery(
    `quote-${id}`,
    () => QuoteApi.findById(id),
    {
      enabled: id !== "new",
      refetchOnWindowFocus: false,
    }
  );

  const [
    createOrUpdateQuoteMutation,
    createOrUpdateQuoteMutationState,
  ] = useMutation(QuoteApi.createOrUpdate, {
    onSuccess: (data) => {
      if (data.id !== id) {
        history.push(ROUTES.QUOTE_FORM.path.replace(":id", data.id));
      } else {
        queryCache.invalidateQueries("quotes");
        refetch();
      }
    },
    throwOnError: true,
  });

  const [
    updateQuoteStatusMutation,
    updateQuoteStatusMutationState,
  ] = useMutation(QuoteApi.updateStatus, {
    onSuccess: () => {
      refetch();
      toast.show({ message: "Devis mis à jour", variant: "success" });
    },
  });

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
      if (pdfState.isIdle && quote?.id) {
        pdfState.update("loading");
        const blob = await PdfApi.getQuotePdf(quote.id);
        const link = document.createElement("a");
        link.download = quote.id ?? "unknown.pdf";
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
          {!newQuote.id ? "Nouveau devis" : "Modifier un devis"}
        </h1>
        {/* {newQuote?.id && isQuoteMinimumAccepted() ? (
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
        ) : null} */}
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
            Télécharger le PDF
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

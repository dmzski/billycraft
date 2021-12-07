import { Badge, Button } from "@coco-ui/core";
import React from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { PdfApi } from "../../../api/PdfApi";
import useLoadingState from "../../../hooks/useLoadingState";
import Quote from "../../../models/Quote";
import { useToast } from "../../../providers/ToastProvider";
import { ROUTES } from "../../../routes";
import QuoteForm from "./Form";
import { QuoteApi } from "api/QuoteApi";
import { isQuoteMinimumAccepted } from "utils/quote";
import { QUOTE_STATUS } from "constants/quote";
import { STRINGS } from "constants/strings";

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

  const [createBillFromQuote, createBillFromQuoteState] = useMutation(
    QuoteApi.createBill,
    {
      onSuccess: (data) => {
        toast.show({ message: STRINGS.BILL_CREATED, variant: "success" });
        queryCache.invalidateQueries("bills");
        if (data.id) {
          history.push(ROUTES.BILL_FORM.path.replace(":id", data.id));
        } else {
          history.push(ROUTES.BILLS.path);
        }
      },
      throwOnError: true,
    }
  );

  async function onSubmitSuccess(data: Quote) {
    if (data.id !== id) {
      history.push(ROUTES.QUOTE_FORM.path.replace(":id", data.id));
    } else {
      queryCache.invalidateQueries("quotes");
      refetch();
    }
  }

  const downloadPdf = async () => {
    try {
      if (pdfState.isIdle && quote?.id) {
        pdfState.update("loading");
        const blob = await PdfApi.getQuotePdf(quote.id);
        const link = document.createElement("a");
        link.download = quote.id;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        pdfState.update("idle");
      }
    } catch {
      toast.show({
        message: "Erreur lors de la génération du PDF",
        variant: "error",
      });
      setTimeout(() => {
        pdfState.update("idle");
      }, 1000);
    }
  };

  const createBill = React.useCallback(() => {
    createBillFromQuote({ id: newQuote.id });
  }, [newQuote, createBillFromQuote]);

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
        <div className="flex items-end flex-grow">
          <h1 className="text-3xl">
            {!newQuote.id ? "Nouveau devis" : "Modifier un devis"}
          </h1>
          {newQuote.status ? (
            <Badge variant="outline" className="text-xs ml-2 my-2 px-2">
              {QUOTE_STATUS[newQuote.status]?.text}
            </Badge>
          ) : null}
        </div>
        <Button
          variant="success"
          size="sm"
          className="mb-2 mr-2"
          onClick={createBill}
          title="Créer la facture"
          disabled={
            createBillFromQuoteState.isLoading ||
            !isQuoteMinimumAccepted(newQuote) ||
            !newQuote.id
          }
          icon="document-add"
        >
          Créer la facture
        </Button>
        <Button
          disabled={pdfState.isLoading || !newQuote.id}
          title="Télécharger le PDF"
          onClick={downloadPdf}
          variant="primary"
          className="mb-2"
          size="sm"
          icon="document-download"
        >
          Télécharger le PDF
        </Button>
      </div>
      <QuoteForm onSubmitSuccess={onSubmitSuccess} quote={newQuote} />
    </div>
  );
};

export default QuoteCreationPage;

import { ActionButton, Icon, Table } from "@coco-ui/core";
import { format, parseJSON } from "date-fns";
import { Quote } from "models/Quote";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { useParams } from "react-router-dom";
import { QUOTE_STATUS } from "../../constants/quote";
import QuoteModal from "../../containers/modals/QuoteModal";
import { QuoteGraphQL } from "../../graphql/QuoteGraphQL";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import { getQuoteTotal } from "../../utils/quote";

const QuoteTableLine = ({ quote, isEven }: { quote: Quote; isEven?: boolean }): JSX.Element => {
  const [openStatusPopup, setOpenStatusPopup] = React.useState<boolean>(false);
  const statusRef = React.useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const queryCache = useQueryCache();
  const toast = useToast();
  const { id } = useParams<any>();

  const [updateQuoteStatusMutation, updateQuoteStatusMutationState] = useMutation(QuoteGraphQL.updateQuoteStatus, {
    onSuccess: () => {
      toast.show({ message: "Devis mis à jour", variant: "success" });
    },
  });

  const updateQuoteStatus = (status: QuoteStatusEnum) => async (e: any) => {
    e.stopPropagation();
    if (updateQuoteStatusMutationState.isLoading) {
      return false;
    }
    try {
      quote.id && (await updateQuoteStatusMutation({ id: quote.id, statusEnum: status }));
      setOpenStatusPopup(false);
      queryCache.invalidateQueries("quotes");
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  const editQuote = () => {
    setIsModalOpen(!isModalOpen);
  };

  React.useEffect(() => {
    if (quote && id === quote.id) {
      setIsModalOpen(true);
    }
  }, [id, quote]);

  const getStatus = React.useMemo(() => {
    const status = Object.values(QUOTE_STATUS).find((s) => s.enum === quote.status);

    return (
      <div className="flex items-center">
        <Icon name={(status?.icon as any) || "question-mark-circle"} />
        <span className="ml-1">{status?.text}</span>
      </div>
    );
  }, [quote, openStatusPopup]);

  const getNextStatuses = React.useCallback(() => {
    const array = [];
    switch (quote.status) {
      case QuoteStatusEnum.SENT:
        array.push(QUOTE_STATUS.ACCEPTED, QUOTE_STATUS.REFUSED, QUOTE_STATUS.DEPOSIT_ASK, QUOTE_STATUS.DEPOSIT_PAID, QUOTE_STATUS.ARCHIVED);
        break;
      case QuoteStatusEnum.REFUSED:
        array.push(QUOTE_STATUS.DRAFT, QUOTE_STATUS.ARCHIVED);
        break;
      case QuoteStatusEnum.ACCEPTED:
        array.push(QUOTE_STATUS.DRAFT, QUOTE_STATUS.DEPOSIT_ASK, QUOTE_STATUS.DEPOSIT_PAID, QUOTE_STATUS.ARCHIVED);
        break;
      case QuoteStatusEnum.DEPOSIT_ASK:
        array.push(QUOTE_STATUS.DEPOSIT_PAID, QUOTE_STATUS.ARCHIVED);
        break;
      case QuoteStatusEnum.DEPOSIT_PAID:
        array.push(QUOTE_STATUS.ARCHIVED);
        break;
      case QuoteStatusEnum.DRAFT:
      default:
        array.push(...Object.values(QUOTE_STATUS));
    }
    return array;
  }, [quote]);

  React.useEffect(() => {
    function handleClickOutside(event: any) {
      if (statusRef.current && !statusRef.current.contains(event.target) && openStatusPopup) {
        event.stopPropagation();
        event.preventDefault();
        setOpenStatusPopup(false);
      }
    }
    if (openStatusPopup) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusRef, openStatusPopup]);

  return (
    <Table.Row isEven={isEven} hoverable onClick={editQuote}>
      <Table.Cell className="pl-2 py-3 truncate">{quote.title}</Table.Cell>
      <Table.Cell className="truncate">{quote.customer.name}</Table.Cell>
      <Table.Cell className="">{quote.createdAt ? format(parseJSON(quote.createdAt), "dd/MM/yyyy à HH:mm") : "-"}</Table.Cell>
      <Table.Cell className="">{quote.sentAt ? format(parseJSON(quote.sentAt), "dd/MM/yyyy à HH:mm") : "-"}</Table.Cell>
      <Table.Cell className="">{Math.round(getQuoteTotal(quote) * 100) / 100} €</Table.Cell>
      <Table.Cell
        className=""
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <ActionButton size="sm" variant="outline">
          <ActionButton.Content>{getStatus}</ActionButton.Content>
          {getNextStatuses().map((s, index) => (
            <ActionButton.Action key={index} onClick={updateQuoteStatus(s.enum as QuoteStatusEnum)}>
              <div className="flex items-center">
                <Icon className="mr-2" name={s.icon as any} />
                <span>{s.text}</span>
              </div>
            </ActionButton.Action>
          ))}
        </ActionButton>

        <QuoteModal
          quote={quote}
          onRequestClose={() => {
            setIsModalOpen(false);
          }}
          isOpen={isModalOpen}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default QuoteTableLine;

import { format, parseJSON } from "date-fns";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { useParams } from "react-router-dom";
import { QUOTE_STATUS } from "../../constants/quote";
import QuoteModal from "../../containers/modals/QuoteModal";
import { QuoteGraphQL } from "../../graphql/QuoteGraphQL";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import { getQuoteTotal } from "../../utils/quote";

const QuoteTableLine: React.FC<any> = ({ quote, isSelected, onSelect, setQuote, isEven }) => {
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
      await updateQuoteStatusMutation({ id: quote.id, statusEnum: status });
      setOpenStatusPopup(false);
      queryCache.invalidateQueries("quotes");
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  const editQuote = (e: any) => {
    setIsModalOpen(!isModalOpen);
  };

  React.useEffect(() => {
    if (quote && id === quote.id) {
      setIsModalOpen(true);
    }
  }, [id, quote]);

  const getStatus = React.useMemo(() => {
    const status = Object.values(QUOTE_STATUS).find((s) => s.enum === quote.status);
    const onStatusClick = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (quote.status !== QuoteStatusEnum.ARCHIVED) {
        setOpenStatusPopup(!openStatusPopup);
      }
      return false;
    };

    return (
      <div className="status-text" onClick={onStatusClick}>
        <span style={{ marginRight: 7 }} className="material-icons">
          {status?.icon}
        </span>
        <span>{status?.text}</span>
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
        array.push(QUOTE_STATUS.DEPOSIT_ASK, QUOTE_STATUS.DEPOSIT_PAID, QUOTE_STATUS.ARCHIVED);
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
    <tr className={"quote-table-line hover " + (isSelected ? "selected" : "")} onClick={editQuote}>
      <td className="pl-3 text-left truncate">{quote.title}</td>
      <td className="text-center truncate">{quote.customer.name}</td>
      <td className="text-center">{quote.createdAt ? format(parseJSON(quote.createdAt), "dd/MM/yyyy à HH:mm") : ""}</td>
      <td className="text-center">{quote.sentAt ? format(parseJSON(quote.sentAt), "dd/MM/yyyy à HH:mm") : ""}</td>
      <td className="text-center">{Math.round(getQuoteTotal(quote) * 100) / 100} €</td>
      <td className="text-center status" ref={statusRef}>
        {getStatus}
        {openStatusPopup && (
          <div className="popup">
            {getNextStatuses().map((s, index) => (
              <div key={index} onClick={updateQuoteStatus(s.enum as QuoteStatusEnum)}>
                <span className="material-icons">{s.icon}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        )}
      </td>
      <QuoteModal
        quote={quote}
        onRequestClose={(e: any) => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
      />
    </tr>
  );
};

export default QuoteTableLine;

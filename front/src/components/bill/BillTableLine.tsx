import { format, parseJSON } from "date-fns";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { useParams } from "react-router-dom";
import { BILL_STATUS } from "../../constants/bill";
import BillModal from "../../containers/modals/BillModal";
import { BillGraphQL } from "../../graphql/BillGraphQL";
import { BillStatusEnum } from "../../models/BillStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import { getBillTotal } from "../../utils/bill";

const BillTableLine: React.FC<any> = ({ bill, isSelected, onSelect, setBill, isEven }) => {
  const [openStatusPopup, setOpenStatusPopup] = React.useState<boolean>(false);
  const statusRef = React.useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const queryCache = useQueryCache();
  const toast = useToast();
  const { id } = useParams<any>();

  const [updateBillStatusMutation, updateBillStatusMutationState] = useMutation(BillGraphQL.updateBillStatus, {
    onSuccess: () => {
      toast.show({ message: "Facture mis à jour", variant: "success" });
    },
    throwOnError: true,
  });

  const updateBillStatus = (status: BillStatusEnum) => async (e: any) => {
    e.stopPropagation();
    if (updateBillStatusMutationState.isLoading) {
      return false;
    }
    try {
      await updateBillStatusMutation({ id: bill.id, statusEnum: status });
      setOpenStatusPopup(false);
      queryCache.invalidateQueries("bills");
    } catch (error) {
      toast.show({ message: "Erreur lors de la mise à jour", variant: "error" });
      console.error("Error !!!", error);
    }
  };

  const editBill = (e: any) => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (bill && id === bill.id) {
      setIsModalOpen(true);
    }
  }, [id, bill]);

  const getStatus = React.useMemo(() => {
    const status = Object.values(BILL_STATUS).find((s) => s.enum === bill.status);
    const onStatusClick = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (bill.status !== BillStatusEnum.ARCHIVED) {
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
  }, [bill, openStatusPopup]);

  const getNextStatuses = React.useCallback(() => {
    const array = [];
    switch (bill.status) {
      case BillStatusEnum.SENT:
        array.push(BILL_STATUS.REFUSED, BILL_STATUS.PAYMENT_PAID, BILL_STATUS.ARCHIVED);
        break;
      case BillStatusEnum.REFUSED:
        array.push(BILL_STATUS.DRAFT, BILL_STATUS.ARCHIVED);
        break;
      case BillStatusEnum.PAYMENT_PAID:
        array.push(BILL_STATUS.ARCHIVED);
        break;
      case BillStatusEnum.DRAFT:
      default:
        array.push(...Object.values(BILL_STATUS));
    }
    return array;
  }, [bill]);

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
    <tr className={"bill-table-line hover " + (isSelected ? "selected" : "")} onClick={editBill}>
      <td className="pl-2 text-left truncate">{bill.title}</td>
      <td className="text-center truncate">{bill.customer.name}</td>
      <td className="text-center">{bill.createdAt ? format(parseJSON(bill.createdAt), "dd/MM/yyyy à HH:mm") : ""}</td>
      <td className="text-center">{bill.sentAt ? format(parseJSON(bill.sentAt), "dd/MM/yyyy à HH:mm") : ""}</td>
      <td className="text-center">{Math.round(getBillTotal(bill) * 100) / 100} €</td>
      <td className="text-center status" ref={statusRef}>
        {getStatus}
        {openStatusPopup && (
          <div className="popup">
            {getNextStatuses().map((s, index) => (
              <div key={index} onClick={updateBillStatus(s.enum as BillStatusEnum)}>
                <span className="material-icons">{s.icon}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        )}
      </td>
      <BillModal
        bill={bill}
        onRequestClose={(e: any) => {
          if (e) {
            e.stopPropagation();
          }
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
      />
    </tr>
  );
};

export default BillTableLine;

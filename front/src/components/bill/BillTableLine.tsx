import { ActionButton, Icon, Table } from "@coco-ui/core";
import { format, parseJSON } from "date-fns";
import { Bill } from "models/Bill";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { useParams } from "react-router-dom";
import { BILL_STATUS } from "../../constants/bill";
import BillModal from "../../containers/modals/BillModal";
import { BillGraphQL } from "../../graphql/BillGraphQL";
import { BillStatusEnum } from "../../models/BillStatusEnum";
import { useToast } from "../../providers/ToastProvider";
import { getBillTotal } from "../../utils/bill";

type BillTableLineProps = {
  bill: Bill;
};
const BillTableLine = ({ bill }: BillTableLineProps): JSX.Element => {
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
      bill.id && (await updateBillStatusMutation({ id: bill.id, statusEnum: status }));
      setOpenStatusPopup(false);
      queryCache.invalidateQueries("bills");
    } catch (error) {
      toast.show({ message: "Erreur lors de la mise à jour", variant: "error" });
      console.error("Error !!!", error);
    }
  };

  const editBill = () => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (bill && id === bill.id) {
      setIsModalOpen(true);
    }
  }, [id, bill]);

  const getStatus = React.useMemo(() => {
    const status = Object.values(BILL_STATUS).find((s) => s.enum === bill.status);

    return (
      <div className="flex items-center">
        <Icon name={(status?.icon as any) || "question-mark-circle"} />
        <span className="ml-1">{status?.text}</span>
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
    <Table.Row onClick={editBill} hoverable>
      <Table.Cell className="pl-2 py-3 truncate">{bill.title}</Table.Cell>
      <Table.Cell className="truncate">{bill.customer.name}</Table.Cell>
      <Table.Cell className="">{bill.createdAt ? format(parseJSON(bill.createdAt), "dd/MM/yyyy à HH:mm") : ""}</Table.Cell>
      <Table.Cell className="">{bill.sentAt ? format(parseJSON(bill.sentAt), "dd/MM/yyyy à HH:mm") : ""}</Table.Cell>
      <Table.Cell className="">{Math.round(getBillTotal(bill) * 100) / 100} €</Table.Cell>
      <Table.Cell
        className=""
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <ActionButton size="sm" variant="outline">
          <ActionButton.Content>{getStatus}</ActionButton.Content>
          {getNextStatuses().map((s, index) => (
            <ActionButton.Action key={index} onClick={updateBillStatus(s.enum as BillStatusEnum)}>
              <div className="flex items-center">
                <Icon className="mr-2" name={s.icon as any} />
                <span>{s.text}</span>
              </div>
            </ActionButton.Action>
          ))}
        </ActionButton>
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
      </Table.Cell>
    </Table.Row>
  );
};

export default BillTableLine;

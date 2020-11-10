import { format } from "date-fns";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { ROUTES } from "../../routes";
import Modal from "react-modal";
import CustomerForm from "../../containers/forms/CustomerForm";

const QuoteTableLine: React.FC<any> = ({ customer, isEven }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const { id } = useParams<any>();

  const editCustomer = (e: any) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  React.useEffect(() => {
    if (customer && id === customer.id) {
      setIsOpen(true);
    }
  }, [id, customer]);

  return (
    <tr className="quote-table-line hover " onClick={editCustomer}>
      <td className="px-2">
        <input type="checkbox" onChange={(e) => {}} />
      </td>
      <td className="text-left">{customer.name}</td>
      <td className="text-center">{customer.contact}</td>
      <td className="text-center">{customer.phoneNumber ? customer.phoneNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5") : ""}</td>
      <td className="text-center">{customer.email}</td>
      <Modal
        className="modal"
        overlayClassName="modal-overlay"
        isOpen={modalIsOpen}
        onRequestClose={(e: any) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        contentLabel="Example Modal"
      >
        <CustomerForm customer={customer} closeModal={() => setIsOpen(false)} />
      </Modal>
    </tr>
  );
};

export default QuoteTableLine;

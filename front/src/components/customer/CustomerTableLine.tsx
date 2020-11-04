import { format } from "date-fns";
import React from "react";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../routes";
import Modal from "react-modal";
import CustomerForm from "../../containers/forms/CustomerForm";

const QuoteTableLine: React.FC<any> = ({ customer, isEven }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const editCustomer = (e: any) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <tr className="quote-table-line" onClick={editCustomer}>
      <td className="px-2">
        <input type="checkbox" onChange={(e) => {}} />
      </td>
      <td>{customer.name}</td>
      <td>{customer.contact}</td>
      <td>{customer.phoneNumber}</td>
      <td>{customer.city}</td>
      <td>{customer.postalCode}</td>
      <td className="overflow-hidden">{customer.address}</td>
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

import React from "react";
import { useParams } from "react-router-dom";
import CustomerModal from "../../containers/modals/CustomerModal";

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
      <td className="pl-2 text-left truncate">{customer.name}</td>
      <td className="text-center truncate">{customer.contact}</td>
      <td className="text-center">{customer.phoneNumber ? customer.phoneNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5") : ""}</td>
      <td className="text-center">{customer.email}</td>
      <CustomerModal
        isOpen={modalIsOpen}
        onRequestClose={(e: any) => {
          if (e) e.stopPropagation();
          setIsOpen(false);
        }}
        customer={customer}
      />
    </tr>
  );
};

export default QuoteTableLine;

import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import CustomerForm from "../containers/forms/CustomerForm";
import Layout from "../containers/layout/Layout";
import CustomerTable from "../containers/tables/CustomerTable";
import { CustomerGraphQL } from "../graphql/CustomerGraphQL";
import { ROUTES } from "../routes";
import Modal from "react-modal";

const mockData = (nbLine: number) => {
  const array: any[] = [];
  for (let i = 0; i < nbLine; i++) {
    array.push({
      id: i,
      name: "Client " + i,
      contact: "Contact " + i,
      phone:
        "06" +
        Math.round(i * 100 * Math.random())
          .toString()
          .padEnd(8, "9"),
      address: ("Adresse " + i + " ").padEnd(50, "bla"),
      city: "Ville " + i,
      postalCode: "20137",
    });
  }
  return array;
};

const Customer = () => {
  const customersQuery = useQuery("customers-query", CustomerGraphQL.getAllCustomers);
  const history = useHistory();
  const [isOpen, setIsOpen] = React.useState(false);

  const goToNewCustomer = (e: any) => {
    setIsOpen(true);
  };

  return (
    <Layout>
      <div className="flex flex-row-reverse">
        <button className="primary" onClick={goToNewCustomer}>
          <span className="material-icons">add</span>
          <p>Nouveau client</p>
        </button>
      </div>
      <div>
        <CustomerTable data={customersQuery.data} />
        {customersQuery.isLoading && <div>Chargement en cours...</div>}
      </div>
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} className="modal" overlayClassName="modal-overlay">
        <CustomerForm closeModal={() => setIsOpen(false)} />
      </Modal>
    </Layout>
  );
};

export default Customer;

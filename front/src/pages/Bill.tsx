import React from "react";
import { useQuery } from "react-query";
import Layout from "../containers/layout/Layout";
import BillTable from "../containers/tables/BillTable";
import { BillGraphQL } from "../graphql/BillGraphQL";
import { Bill } from "../models/Bill";
import { filterBills, sortBills } from "../utils/bill";
import BillModal from "../containers/modals/BillModal";
import BillFilterContainer from "../containers/BillFilterContainer";
import { useParams } from "react-router-dom";

const BillPage = () => {
  const [selected, setSelected] = React.useState<number[]>([]);
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [filters, setFilters] = React.useState<any>({});
  const [showArchived, setShowArchived] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const billsArchivedQuery = useQuery("bills-archived", BillGraphQL.getAllBillsArchived, { enabled: false });
  const billsQuery = useQuery("bills", BillGraphQL.getAllBillsNotArchived);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { id } = useParams<any>();

  const billSorted = React.useCallback(() => {
    const list = [...bills];
    if (billsArchivedQuery.data && showArchived) {
      list.push(...billsArchivedQuery.data);
    }
    return sortBills(filterBills(list, filters));
  }, [bills, billsArchivedQuery.data, showArchived, filters]);

  const goToNewBill = () => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (billsQuery.data) {
      setBills(billsQuery.data);
    }
    if (id && billsQuery.data && !billsQuery.data.some((bill: any) => bill.id === id)) {
      setShowArchived(true);
      billsArchivedQuery.refetch();
    }
  }, [billsQuery, id]);

  const handleShowArchived = () => {
    setShowArchived(!showArchived);
    if (!showArchived) {
      billsArchivedQuery.refetch();
    }
  };
  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {showArchived ? (
          <button className="button" onClick={handleShowArchived}>
            <span className="material-icons mr-2">visibility_off</span>
            <p>Masquer les factures archivées</p>
          </button>
        ) : (
          <button className="button" onClick={handleShowArchived}>
            <span className="material-icons mr-2">visibility</span>
            <p>Voir les factures archivées</p>
          </button>
        )}
        {showFilters ? (
          <button className="button default" onClick={handleShowFilters}>
            <span className="material-icons mr-2">filter_alt</span>
            <p>Masquer les filres</p>
          </button>
        ) : (
          <button className="button info" onClick={handleShowFilters}>
            <span className="material-icons mr-2">filter_alt</span>
            <p>Afficher les filtres</p>
          </button>
        )}
        <button className="primary" onClick={goToNewBill}>
          <span className="material-icons mr-2">add</span>
          <p>Nouvelle facture</p>
        </button>
      </div>
      {showFilters && <BillFilterContainer filters={filters} setFilters={setFilters} />}
      <div>
        <BillTable data={billSorted()} selected={selected} setSelected={setSelected} setData={setBills} />
        {(billsArchivedQuery.isLoading || billsQuery.isLoading) && <div>Chargement en cours...</div>}
      </div>
      <BillModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
        style={{ content: { minWidth: "80%" } }}
      />
    </>
  );
};

export default BillPage;

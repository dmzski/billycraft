import React from "react";
import { useQuery } from "react-query";
import BillTable from "../containers/tables/BillTable";
import { BillGraphQL } from "../graphql/BillGraphQL";
import { Bill } from "../models/Bill";
import { filterBills, sortBills } from "../utils/bill";
import BillModal from "../containers/modals/BillModal";
import BillFilterContainer from "../containers/BillFilterContainer";
import { useParams } from "react-router-dom";
import { Button, Grid, Loader } from "@coco-ui/core";

const BillPage = (): JSX.Element => {
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
      <Grid cols={3}>
        <div>
          {showArchived ? (
            <Button size="md" variant="default" icon="eye-off" onClick={handleShowArchived}>
              Masquer les factures archivées/payées
            </Button>
          ) : (
            <Button size="md" variant="default" icon="eye" onClick={handleShowArchived}>
              Voir les factures archivées/payées
            </Button>
          )}
        </div>
        <div className="flex justify-center">
          {showFilters ? (
            <Button size="md" icon="filter" variant="info" onClick={handleShowFilters}>
              Masquer les filres
            </Button>
          ) : (
            <Button size="md" variant="info" icon="filter" onClick={handleShowFilters}>
              Afficher les filtres
            </Button>
          )}
        </div>
        <div className="flex flex-row-reverse">
          <Button size="md" icon="plus" onClick={goToNewBill}>
            Nouvelle facture
          </Button>
        </div>
      </Grid>
      {showFilters && <BillFilterContainer filters={filters} setFilters={setFilters} />}
      <BillTable data={billSorted()} selected={selected} setSelected={setSelected} setData={setBills} />
      {(billsArchivedQuery.isLoading || billsQuery.isLoading) && (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      )}
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

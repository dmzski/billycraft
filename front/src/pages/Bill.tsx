import React from "react";
import { useQuery } from "react-query";
import BillTable from "../containers/tables/BillTable";
import { filterBills, sortBills } from "../utils/bill";
import BillModal from "../containers/modals/BillModal";
import BillFilterContainer from "../containers/BillFilterContainer";
import { useParams } from "react-router-dom";
import { Button, Grid, Loader } from "@coco-ui/core";
import useCustomers from "hooks/useCustomers";
import { BillApi } from "api/BillApi";

const BillPage = (): JSX.Element => {
  const customers = useCustomers();
  const [filters, setFilters] = React.useState<any>({});
  const [showArchived, setShowArchived] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const billsQuery = useQuery(
    ["bills", showArchived ? "archived" : "notArchived"],
    showArchived ? BillApi.findAllArchived : BillApi.findAllNotArchived
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { id } = useParams<any>();

  const billSorted = React.useCallback(() => {
    return sortBills(filterBills(billsQuery.data ?? [], filters, customers));
  }, [billsQuery.data, showArchived, filters]);

  const goToNewBill = () => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (
      id &&
      billsQuery.data &&
      !billsQuery.data.some((bill: any) => bill.id === id)
    ) {
      setShowArchived(true);
    }
  }, [billsQuery, id]);

  const handleShowArchived = () => {
    setShowArchived(!showArchived);
  };
  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <Grid cols={3}>
        <div>
          {showArchived ? (
            <Button
              size="md"
              variant="default"
              icon="eye-off"
              onClick={handleShowArchived}
            >
              Masquer les factures archivées/payées
            </Button>
          ) : (
            <Button
              size="md"
              variant="default"
              icon="eye"
              onClick={handleShowArchived}
            >
              Voir les factures archivées/payées
            </Button>
          )}
        </div>
        <div className="flex justify-center">
          {showFilters ? (
            <Button
              size="md"
              icon="filter"
              variant="info"
              onClick={handleShowFilters}
            >
              Masquer les filres
            </Button>
          ) : (
            <Button
              size="md"
              variant="info"
              icon="filter"
              onClick={handleShowFilters}
            >
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
      {showFilters ? (
        <BillFilterContainer filters={filters} setFilters={setFilters} />
      ) : null}
      <BillTable data={billSorted()} />
      {billsQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
      <BillModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BillPage;

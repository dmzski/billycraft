import React from "react";
import { useQuery } from "react-query";
import BillTable from "./List";
import { filterBills, sortBills } from "../../utils/bill";
import BillFilterContainer from "./Filters";
import { Button, Grid, Loader } from "@coco-ui/core";
import useCustomers from "hooks/useCustomers";
import { BillApi } from "api/BillApi";
import { useHistory } from "react-router";
import { ROUTES } from "routes";

const BillPage = (): JSX.Element => {
  const customers = useCustomers();
  const [filters, setFilters] = React.useState<any>({});
  const [showArchived, setShowArchived] = React.useState(false);
  const billsQuery = useQuery(
    ["bills", showArchived ? "archived" : "notArchived"],
    showArchived ? BillApi.findAllArchived : BillApi.findAllNotArchived
  );
  const history = useHistory();

  const billSorted = React.useCallback(() => {
    return sortBills(filterBills(billsQuery.data ?? [], filters, customers));
  }, [billsQuery.data, showArchived, filters]);

  const goToNewBill = () => {
    history.push(ROUTES.BILL_FORM.path.replace(":id", "new"));
  };

  const handleShowArchived = React.useCallback(() => {
    setShowArchived((current) => !current);
  }, []);

  return (
    <>
      <h1 className="text-3xl">Factures</h1>
      <Grid cols={2} className="my-8">
        <div>
          {showArchived ? (
            <Button
              size="md"
              variant="secondary"
              icon="eye-off"
              onClick={handleShowArchived}
            >
              Masquer les factures archivées/payées
            </Button>
          ) : (
            <Button
              size="md"
              variant="secondary"
              icon="eye"
              onClick={handleShowArchived}
            >
              Voir les factures archivées/payées
            </Button>
          )}
        </div>
        <div className="flex flex-row-reverse">
          <Button size="md" icon="plus" onClick={goToNewBill}>
            Nouvelle facture
          </Button>
        </div>
      </Grid>
      <BillFilterContainer filters={filters} setFilters={setFilters} />
      <BillTable data={billSorted()} />
      {billsQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  );
};

export default BillPage;

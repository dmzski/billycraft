import React from "react";
import { useQuery } from "react-query";
import BillTable from "./List";
import { filterBills, sortBills } from "../../utils/bill";
import BillFilterContainer from "./Filters";
import { Button, Loader } from "@coco-ui/core";
import useCustomers from "hooks/useCustomers";
import { BillApi } from "api/BillApi";
import { useHistory } from "react-router";
import { ROUTES } from "routes";

const BillPage = (): JSX.Element => {
  const customers = useCustomers();
  const [filters, setFilters] = React.useState<any>({});
  const billsQuery = useQuery("bills-notArchived", BillApi.findAllNotArchived);
  const history = useHistory();

  const billSorted = React.useCallback(() => {
    return sortBills(filterBills(billsQuery.data ?? [], filters, customers));
  }, [billsQuery.data, filters]);

  const goToNewBill = () => {
    history.push(ROUTES.BILL_FORM.path.replace(":id", "new"));
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl">Factures</h1>
        <Button size="md" icon="plus" onClick={goToNewBill}>
          Nouvelle facture
        </Button>
      </div>
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

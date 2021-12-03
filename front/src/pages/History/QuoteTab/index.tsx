import { QuoteApi } from "api/QuoteApi";
import Loader from "components/Loader";
import useCustomers from "hooks/useCustomers";
import QuoteFilterContainer from "pages/Quotes/Filters";
import QuoteList from "pages/Quotes/List";
import React from "react";
import { useQuery } from "react-query";
import { filterQuotes, sortQuotes } from "utils/quote";

const QuoteTab = (): JSX.Element => {
  const customers = useCustomers();
  const [filters, setFilters] = React.useState<any>({});

  const quotesQuery = useQuery("quotes-archived", QuoteApi.findAllArchived, {
    refetchOnWindowFocus: false,
  });
  const quoteSorted = React.useCallback(() => {
    return sortQuotes(filterQuotes(quotesQuery.data ?? [], filters, customers));
  }, [filters, quotesQuery.data]);
  return (
    <>
      <QuoteFilterContainer filters={filters} setFilters={setFilters} />
      <QuoteList data={quoteSorted()} />
      {quotesQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  );
};

export default QuoteTab;

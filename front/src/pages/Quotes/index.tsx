import React from "react";
import { useQuery } from "react-query";
import QuoteList from "./List";
import { filterQuotes, sortQuotes } from "../../utils/quote";
import QuoteFilterContainer from "./Filters";
import { useHistory, useParams } from "react-router-dom";
import { Button, Grid, Loader } from "@coco-ui/core";
import { ROUTES } from "routes";
import { QuoteApi } from "api/QuoteApi";
import useCustomers from "hooks/useCustomers";

const QuotePage = (): JSX.Element => {
  const customers = useCustomers();
  const [filters, setFilters] = React.useState<any>({});
  const [showArchived, setShowArchived] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  const quotesQuery = useQuery(
    ["quotes", showArchived ? "archived" : "notArchived"],
    showArchived ? QuoteApi.findAllArchived : QuoteApi.findAllNotArchived,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { id } = useParams<any>();
  const history = useHistory();

  const quoteSorted = React.useCallback(() => {
    return sortQuotes(filterQuotes(quotesQuery.data ?? [], filters, customers));
  }, [showArchived, filters, quotesQuery.data]);

  const goToNewQuote = () => {
    history.push(ROUTES.QUOTE_FORM.path.replace(":id", "new"));
  };

  React.useEffect(() => {
    if (
      id &&
      quotesQuery.data &&
      !quotesQuery.data.some((quote: any) => quote.id === id)
    ) {
      setShowArchived(true);
    }
  }, [quotesQuery, id]);

  const handleShowArchived = () => {
    setShowArchived(!showArchived);
  };
  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <h2 className="text-3xl">Devis</h2>
      <Grid cols={3} className="my-8">
        <div>
          <Button
            size="md"
            variant="default"
            icon={showArchived ? "eye-off" : "eye"}
            onClick={handleShowArchived}
          >
            {showArchived
              ? "Masquer les devis archivés"
              : "Voir les devis archivés"}
          </Button>
        </div>
        <div className="flex justify-center">
          <Button
            size="md"
            variant="info"
            icon="filter"
            onClick={handleShowFilters}
          >
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>
        <div className="flex justify-end">
          <Button size="md" onClick={goToNewQuote} icon="plus">
            <p>Nouveau devis</p>
          </Button>
        </div>
      </Grid>
      {showFilters ? (
        <QuoteFilterContainer filters={filters} setFilters={setFilters} />
      ) : null}
      <QuoteList data={quoteSorted()} />
      {quotesQuery.isLoading ? (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  );
};

export default QuotePage;

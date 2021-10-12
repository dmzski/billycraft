import React from "react";
import { useQuery } from "react-query";
import QuoteList from "../containers/lists/QuoteList";
import { QuoteGraphQL } from "../graphql/QuoteGraphQL";
import { Quote } from "../models/Quote";
import { filterQuotes, sortQuotes } from "../utils/quote";
import QuoteModal from "../containers/modals/QuoteModal";
import QuoteFilterContainer from "../containers/QuoteFilterContainer";
import { useParams, useHistory } from "react-router-dom";
import { Button, Grid, Loader } from "@coco-ui/core";
import { ROUTES } from "routes";

const QuotePage = (): JSX.Element => {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [filters, setFilters] = React.useState<any>({});
  const [showArchived, setShowArchived] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const quotesArchivedQuery = useQuery("quotes-archived", QuoteGraphQL.getAllQuotesArchived, { enabled: false, refetchOnWindowFocus: false });
  const quotesQuery = useQuery("quotes", QuoteGraphQL.getAllQuotesNotArchived, { refetchOnWindowFocus: false });
  const { id } = useParams<any>();
  const history = useHistory();

  const quoteSorted = React.useCallback(() => {
    const list = [...quotes];
    if (quotesArchivedQuery.data && showArchived) {
      list.push(...quotesArchivedQuery.data);
    }
    return sortQuotes(filterQuotes(list, filters));
  }, [quotes, quotesArchivedQuery.data, showArchived, filters]);

  const goToNewQuote = () => {
    history.push(ROUTES.QUOTE_FORM.path.replace(":id", "new"));
  };

  React.useEffect(() => {
    if (quotesQuery.data) {
      setQuotes(quotesQuery.data);
    }
    if (id && quotesQuery.data && !quotesQuery.data.some((quote: any) => quote.id === id)) {
      setShowArchived(true);
      quotesArchivedQuery.refetch();
    }
  }, [quotesQuery, id]);

  const handleShowArchived = () => {
    setShowArchived(!showArchived);
    if (!showArchived) {
      quotesArchivedQuery.refetch();
    }
  };
  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <Grid cols={3}>
        <div>
          <Button size="md" variant="default" icon={showArchived ? "eye-off" : "eye"} onClick={handleShowArchived}>
            {showArchived ? "Masquer les devis archivés" : "Voir les devis archivés"}
          </Button>
        </div>
        <div className="flex justify-center">
          <Button size="md" variant="info" icon="filter" onClick={handleShowFilters}>
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>
        <div className="flex justify-end">
          <Button size="md" onClick={goToNewQuote} icon="plus">
            <p>Nouveau devis</p>
          </Button>
        </div>
      </Grid>
      {showFilters && <QuoteFilterContainer filters={filters} setFilters={setFilters} />}
      <QuoteList data={quoteSorted()} />
      {(quotesArchivedQuery.isLoading || quotesQuery.isLoading) && (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default QuotePage;

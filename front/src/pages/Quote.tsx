import React from "react";
import { useQuery } from "react-query";
import QuoteList from "../containers/lists/QuoteList";
import { QuoteGraphQL } from "../graphql/QuoteGraphQL";
import { Quote } from "../models/Quote";
import { filterQuotes, sortQuotes } from "../utils/quote";
import QuoteModal from "../containers/modals/QuoteModal";
import QuoteFilterContainer from "../containers/QuoteFilterContainer";
import { useParams } from "react-router-dom";
import { Button, Loader } from "@coco-ui/core";

const QuotePage = (): JSX.Element => {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [filters, setFilters] = React.useState<any>({});
  const [showArchived, setShowArchived] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const quotesArchivedQuery = useQuery("quotes-archived", QuoteGraphQL.getAllQuotesArchived, { enabled: false, refetchOnWindowFocus: false });
  const quotesQuery = useQuery("quotes", QuoteGraphQL.getAllQuotesNotArchived, { refetchOnWindowFocus: false });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { id } = useParams<any>();

  const quoteSorted = React.useCallback(() => {
    const list = [...quotes];
    if (quotesArchivedQuery.data && showArchived) {
      list.push(...quotesArchivedQuery.data);
    }
    return sortQuotes(filterQuotes(list, filters));
  }, [quotes, quotesArchivedQuery.data, showArchived, filters]);

  const goToNewQuote = () => {
    setIsModalOpen(true);
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
      <div className="flex items-center justify-between">
        {showArchived ? (
          <Button size="md" variant="default" icon="eye-off" onClick={handleShowArchived}>
            Masquer les devis archivés
          </Button>
        ) : (
          <Button variant="default" size="md" className="flex" icon="eye" onClick={handleShowArchived}>
            Voir les devis archivés
          </Button>
        )}
        {showFilters ? (
          <Button size="md" variant="info" icon="filter" onClick={handleShowFilters}>
            Masquer les filres
          </Button>
        ) : (
          <Button size="md" variant="info" icon="filter" onClick={handleShowFilters}>
            Afficher les filtres
          </Button>
        )}
        <Button size="md" className="primary" onClick={goToNewQuote} icon="plus">
          <p>Nouveau devis</p>
        </Button>
      </div>
      {showFilters && <QuoteFilterContainer filters={filters} setFilters={setFilters} />}
      <QuoteList data={quoteSorted()} />
      {(quotesArchivedQuery.isLoading || quotesQuery.isLoading) && (
        <div className="mt-2 flex justify-center">
          <Loader />
        </div>
      )}
      <QuoteModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
        style={{ content: { minWidth: "80%" } }}
      />
    </>
  );
};

export default QuotePage;

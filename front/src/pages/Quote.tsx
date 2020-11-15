import React from "react";
import { useQuery } from "react-query";
import Layout from "../containers/layout/Layout";
import QuoteList from "../containers/lists/QuoteList";
import { QuoteGraphQL } from "../graphql/QuoteGraphQL";
import { Quote } from "../models/Quote";
import { filterQuotes, sortQuotes } from "../utils/quote";
import QuoteModal from "../containers/modals/QuoteModal";
import QuoteFilterContainer from "../containers/QuoteFilterContainer";
import { useParams } from "react-router-dom";

const QuotePage = () => {
  const [selected, setSelected] = React.useState<number[]>([]);
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
          <button className="button" onClick={handleShowArchived}>
            <span className="material-icons mr-2">visibility_off</span>
            <p>Masquer les devis archivés</p>
          </button>
        ) : (
          <button className="button" onClick={handleShowArchived}>
            <span className="material-icons mr-2">visibility</span>
            <p>Voir les devis archivés</p>
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
        <button className="primary" onClick={goToNewQuote}>
          <span className="material-icons mr-2">add</span>
          <p>Nouveau devis</p>
        </button>
      </div>
      {showFilters && <QuoteFilterContainer filters={filters} setFilters={setFilters} />}
      <div>
        <QuoteList data={quoteSorted()} selected={selected} setSelected={setSelected} setData={setQuotes} />
        {(quotesArchivedQuery.isLoading || quotesQuery.isLoading) && <div>Chargement en cours...</div>}
      </div>
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

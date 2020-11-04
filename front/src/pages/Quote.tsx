import { setDate, subDays, subHours } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import Layout from "../containers/layout/Layout";
import QuoteList from "../containers/lists/QuoteList";
import { QuoteGraphQL } from "../graphql/QuoteGraphQL";
import { Quote } from "../models/Quote";
import { ROUTES } from "../routes";
import { sortQuotes } from "../utils/quote";
import Modal from "react-modal";
import QuoteForm from "../containers/forms/QuoteForm";
import QuoteModal from "../containers/modals/QuoteModal";

const QuotePage = () => {
  const [selected, setSelected] = React.useState<number[]>([]);
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const quotesQuery = useQuery("quotes", QuoteGraphQL.getAllQuotesNotArchived);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const quoteSorted = React.useCallback(() => {
    return sortQuotes(quotes);
  }, [quotes]);

  const goToNewQuote = (e: any) => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (quotesQuery.data) {
      setQuotes(quotesQuery.data);
    }
  }, [quotesQuery]);

  return (
    <Layout>
      <div className="flex flex-row-reverse">
        <button className="primary" onClick={goToNewQuote}>
          <span className="material-icons">add</span>
          <p>Nouveau devis</p>
        </button>
      </div>
      <div>
        <QuoteList data={quoteSorted()} selected={selected} setSelected={setSelected} setData={setQuotes} />
      </div>
      <QuoteModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
        style={{ content: { minWidth: "80%" } }}
      />
    </Layout>
  );
};

export default QuotePage;

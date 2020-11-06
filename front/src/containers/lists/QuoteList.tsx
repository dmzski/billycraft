import { tmpdir } from "os";
import React from "react";
import QuoteTableLine from "../../components/quote/QuoteTableLine";

const QuoteList: React.FC<any> = ({ data, selected, setSelected, setData }) => {
  const [sort, setSort] = React.useState<any>({ createdAt: -1 });

  const onSelectQuote = (id: number) => {
    const tmp = [...selected];
    if (tmp.includes(id)) {
      tmp.splice(
        tmp.findIndex((s: number) => s === id),
        1
      );
      setSelected(tmp);
    } else {
      tmp.push(id);
      setSelected(tmp);
    }
  };

  const setQuote = (newQuote: any) => {
    const index = data.findIndex((quote: any) => quote.id === newQuote.id);
    if (index > -1) {
      const tmp = [...data];
      tmp.splice(index, 1, newQuote);
      setData(tmp);
    }
  };

  const sortBy = (field: string) => (e: any) => {
    const tmp: any = {};
    tmp[field] = !sort[field] || sort[field] === -1 ? 1 : -1;
    setSort(tmp);
  };

  const getQuoteSorted = React.useCallback(() => {
    if (!data) return [];
    let array = [...data];
    Object.keys(sort).forEach((key) => {
      const order: any = sort[key];
      array = array.sort((a, b) => (a[key] > b[key] ? (order ? (order === 1 ? 1 : -1) : 0) : a[key] < b[key] ? (order ? (order === 1 ? -1 : 1) : 0) : 0));
    });
    return array;
  }, [sort, data]);

  return (
    <table className="table-fixed quote-table">
      <thead>
        <tr>
          <th className="px-4 py-2"></th>
          <QuoteTableHeader className="w-4/12 px-4 py-2 text-left" onClick={sortBy("title")} sort={sort["title"]} text="Titre" />
          <QuoteTableHeader className="w-2/12 px-4 py-2 text-center" onClick={sortBy("customer")} sort={sort["customer"]} text="Client" />
          <QuoteTableHeader className="w-2/12 px-4 py-2 text-center" onClick={sortBy("createdAt")} sort={sort["createdAt"]} text="Création" />
          <QuoteTableHeader className="w-2/12 px-4 py-2 text-center" onClick={sortBy("total")} sort={sort["total"]} text="Total" />
          <QuoteTableHeader className="w-4/12 px-4 py-2 text-center" onClick={sortBy("status")} sort={sort["status"]} text="Status" />
        </tr>
      </thead>
      <tbody>
        {getQuoteSorted().map((quote: any, index: number) => (
          <QuoteTableLine
            isEven={index % 2 === 0}
            isSelected={selected.includes(quote.id)}
            key={quote.id}
            quote={quote}
            onSelect={onSelectQuote}
            setQuote={setQuote}
          />
        ))}
      </tbody>
    </table>
  );
};

const QuoteTableHeader: React.FC<any> = ({ className, onClick, sort, text }) => {
  return (
    <th className={className} onClick={onClick}>
      <div className="flex w-full justify-between">
        <span className="flex-grow">{text}</span>
        {((!sort && sort !== -1) || sort === 0) && <span className="material-icons"></span>}
        {sort === 1 && <span className="material-icons">expand_more</span>}
        {sort === -1 && <span className="material-icons">expand_less</span>}
      </div>
    </th>
  );
};

export default QuoteList;

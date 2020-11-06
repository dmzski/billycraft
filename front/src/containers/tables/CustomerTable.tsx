import React from "react";
import CustomerTableLine from "../../components/customer/CustomerTableLine";

const CustomerTable: React.FC<any> = ({ data }) => {
  const [sort, setSort] = React.useState<any>({ name: 1 });

  const sortBy = (field: string) => (e: any) => {
    const tmp: any = {};
    tmp[field] = !sort[field] || sort[field] === -1 ? 1 : -1;
    setSort(tmp);
  };

  const getCustomersSorted = React.useCallback(() => {
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
          <th className="py-2"></th>
          <QuoteTableHeader className="w-1/2 px-4 py-2 text-left" onClick={sortBy("name")} sort={sort["name"]} text="Nom" />
          <QuoteTableHeader className="w-1/6 px-4 py-2" onClick={sortBy("contact")} sort={sort["contact"]} text="Contact" />
          <QuoteTableHeader className="w-1/6 px-4 py-2" onClick={sortBy("phone")} sort={sort["phone"]} text="Téléphone" />
          <QuoteTableHeader className="w-1/6 px-4 py-2" onClick={sortBy("email")} sort={sort["email"]} text="Email" />
        </tr>
      </thead>
      <tbody>
        {getCustomersSorted().map((customer: any, index: number) => (
          <CustomerTableLine isEven={index % 2 === 0} key={customer.id} customer={customer} />
        ))}
      </tbody>
    </table>
  );
};

const QuoteTableHeader: React.FC<any> = ({ className, onClick, sort, text }) => {
  return (
    <th className={className} onClick={onClick}>
      <div className="flex w-full justify-between">
        <div className="flex-grow">{text}</div>
        {((!sort && sort !== -1) || sort === 0) && <span className="material-icons"></span>}
        {sort === 1 && <span className="material-icons">expand_more</span>}
        {sort === -1 && <span className="material-icons">expand_less</span>}
      </div>
    </th>
  );
};

export default CustomerTable;

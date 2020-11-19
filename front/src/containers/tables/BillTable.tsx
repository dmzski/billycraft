import React from "react";
import BillTableLine from "../../components/bill/BillTableLine";

const BillList: React.FC<any> = ({ data, selected, setSelected, setData }) => {
  const [sort, setSort] = React.useState<any>({ createdAt: -1 });

  const onSelectBill = (id: number) => {
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

  const setBill = (newBill: any) => {
    const index = data.findIndex((bill: any) => bill.id === newBill.id);
    if (index > -1) {
      const tmp = [...data];
      tmp.splice(index, 1, newBill);
      setData(tmp);
    }
  };

  const sortBy = (field: string) => () => {
    const tmp: any = {};
    tmp[field] = !sort[field] || sort[field] === -1 ? 1 : -1;
    setSort(tmp);
  };

  const getBillSorted = React.useCallback(() => {
    if (!data) return [];
    let array = [...data];
    Object.keys(sort).forEach((key) => {
      const order: any = sort[key];
      array = array.sort((a, b) => (a[key] > b[key] ? (order ? (order === 1 ? 1 : -1) : 0) : a[key] < b[key] ? (order ? (order === 1 ? -1 : 1) : 0) : 0));
    });
    return array;
  }, [sort, data]);

  return (
    <table className="table-fixed w-full bill-table">
      <thead>
        <tr>
          <BillTableHeader className="w-auto px-4 py-2 text-left" onClick={sortBy("title")} sort={sort["title"]} text="Titre" />
          <BillTableHeader className="w-64 px-4 py-2 text-center" onClick={sortBy("customer")} sort={sort["customer"]} text="Client" />
          <BillTableHeader className="w-64 px-4 py-2 text-center" onClick={sortBy("createdAt")} sort={sort["createdAt"]} text="Création" />
          <BillTableHeader className="w-64 px-4 py-2 text-center" onClick={sortBy("sentAt")} sort={sort["sentAt"]} text="Envoyé" />
          <BillTableHeader className="w-32 px-4 py-2 text-center" onClick={sortBy("total")} sort={sort["total"]} text="Total" />
          <BillTableHeader className="w-64 px-4 py-2 text-center" onClick={sortBy("status")} sort={sort["status"]} text="Status" />
        </tr>
      </thead>
      <tbody>
        {getBillSorted().map((bill: any, index: number) => (
          <BillTableLine isEven={index % 2 === 0} isSelected={selected.includes(bill.id)} key={bill.id} bill={bill} onSelect={onSelectBill} setBill={setBill} />
        ))}
      </tbody>
    </table>
  );
};

const BillTableHeader: React.FC<any> = ({ className, onClick, sort, text }) => {
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

export default BillList;

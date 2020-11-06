import React from "react";
import BaseInput from "../components/inputs/BaseInput";

const QuoteFilterContainer: React.FC<any> = ({ filters, setFilters }) => {
  return (
    <div className="flex justify-around my-2">
      <BaseInput
        divClassName="mr-3"
        placeholder="Filtrer par titre"
        label="Titre"
        value={filters.title}
        onChange={(e: any) => setFilters({ ...filters, title: e.target.value })}
      />
      <BaseInput
        divClassName="mr-3"
        placeholder="Filtrer par client"
        label="Client"
        value={filters.customer}
        onChange={(e: any) => setFilters({ ...filters, customer: e.target.value })}
      />
      <BaseInput
        placeholder="Filtrer par date de création"
        label="Date de création"
        value={filters.createdAt}
        onChange={(e: any) => setFilters({ ...filters, createdAt: e.target.value })}
      />
    </div>
  );
};

export default QuoteFilterContainer;

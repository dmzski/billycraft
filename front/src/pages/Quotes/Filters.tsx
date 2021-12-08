import { Input } from "@coco-ui/core";
import React from "react";

type QuoteFilterContainerProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

const QuoteFilterContainer = ({
  filters,
  setFilters,
}: QuoteFilterContainerProps): JSX.Element => {
  return (
    <div className="flex justify-around my-2">
      <Input
        placeholder="Filtrer par titre"
        label="Titre"
        value={filters.title}
        onChange={(e: any) => setFilters({ ...filters, title: e.target.value })}
      />
      <Input
        placeholder="Filtrer par client"
        label="Client"
        value={filters.customer}
        onChange={(e: any) =>
          setFilters({ ...filters, customer: e.target.value })
        }
      />
      <Input
        placeholder="Filtrer par date de création"
        label="Date de création"
        value={filters.createdAt}
        onChange={(e: any) =>
          setFilters({ ...filters, createdAt: e.target.value })
        }
      />
      <Input
        placeholder="Filtrer par date d'envoi"
        label="Date d'envoi"
        value={filters.sentAt}
        onChange={(e: any) =>
          setFilters({ ...filters, sentAt: e.target.value })
        }
      />
    </div>
  );
};

export default QuoteFilterContainer;

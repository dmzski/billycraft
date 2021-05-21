import { Icon } from "@coco-ui/core";
import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { SearchApi } from "../api/SearchApi";
import { SearchDTO } from "../models/dtos/SearchDTO";
import { ROUTES } from "../routes";
import SelectInput from "./inputs/SelectInput";

const SearchBar = (): JSX.Element => {
  const [search, setSearch] = React.useState("");
  const history = useHistory();

  const searchQuery = useQuery<SearchDTO[]>(["search-contains", search], SearchApi.searchContains, { enabled: search.length > 1, refetchOnWindowFocus: false });

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleOptionClick = (_event: any, option: any, header?: any) => {
    switch (header) {
      case "QUOTE":
        history.push(ROUTES.QUOTES.path + "/" + option.id);
        break;
      case "BILL":
        history.push(ROUTES.BILLS.path + "/" + option.id);
        break;
      case "CUSTOMER":
        history.push(ROUTES.CUSTOMERS.path + "/" + option.id);
        break;
    }
  };

  return (
    <div className="z-10 h-12 flex flex-grow shadow bg-white pt-3 pb-3 rounded-md">
      <Icon name="search" className="text-gray-500 mx-4" />
      <SelectInput
        id="top-search-input-select"
        data={searchQuery.data ? searchQuery.data.map((value: any) => ({ header: value.category, values: value.results })) : []}
        isLoading={searchQuery.isLoading}
        isError={searchQuery.isError}
        value={search}
        onChange={handleChange}
        onClickOption={handleOptionClick}
        className="w-full focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;

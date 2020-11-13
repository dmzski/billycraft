import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { SearchApi } from "../api/SearchApi";
import { ROUTES } from "../routes";
import SelectInput from "./inputs/SelectInput";

const SearchBar = () => {
  const [search, setSearch] = React.useState("");
  const history = useHistory();

  const searchQuery = useQuery(["search-all", search], SearchApi.searchAll, { enabled: search.length > 1, refetchOnWindowFocus: false });

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleOptionClick = (event: any, option: any, header?: any) => {
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
    <div className="flex bg-white pt-3 pb-3 rounded-md shadow-sm search-div z-10 relative">
      <div className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:leading-5 material-icons mr-3">search</span>
      </div>
      <SelectInput
        id="top-search-input-select"
        data={searchQuery.data ? searchQuery.data.map((value: any) => ({ header: value.category, values: value.results })) : []}
        isLoading={searchQuery.isLoading}
        isError={searchQuery.isError}
        value={search}
        onChange={handleChange}
        onClickOption={handleOptionClick}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;

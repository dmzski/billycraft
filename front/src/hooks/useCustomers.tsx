import { CustomerApi } from "api/CustomerApi";
import Customer from "models/Customer";
import { useQuery } from "react-query";

export default (): Customer[] => {
  const { data } = useQuery("customers", CustomerApi.findAll);
  return data ?? [];
};

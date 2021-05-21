import { Quote } from "./Quote";

export class Customer {
  id?: number;
  city = "";
  contact = "";
  name = "";
  phoneNumber = "";
  postalCode = "";
  email = "";
  address = "";
  quotes: Quote[] = [];
  createdAt?: Date;
  updatedAt?: Date;
}

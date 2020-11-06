import { Quote } from "./Quote";

export class Customer {
  id?: number;
  city: String = "";
  contact: String = "";
  name: String = "";
  phoneNumber: String = "";
  postalCode: String = "";
  email: String = "";
  address: String = "";
  quotes: Quote[] = [];
  createdAt?: Date;
  updatedAt?: Date;
}

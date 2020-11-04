import { Quote } from "./Quote";

export class Customer {
  id?: number;
  city: String = "";
  contact: String = "";
  name: String = "";
  phoneNumber: String = "";
  postalCode: String = "";
  quotes: Quote[] = [];
  createdAt?: Date;
  updatedAt?: Date;
}

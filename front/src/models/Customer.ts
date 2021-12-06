interface Customer {
  id: number;
  name: string;
  contact: string;
  phoneNumber: string;
  city: string;
  postalCode: string;
  address: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  companyId: number;
  deleted?: boolean;
}

export default Customer;

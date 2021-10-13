interface BillEmailCustomization {
  id: number;
  body: string;
  object: string;
  sendAutomatically: boolean;
  companyId: number;
}

export default BillEmailCustomization;

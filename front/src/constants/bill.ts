const BILL_STATUS = {
  DRAFT: { enum: "DRAFT", text: "Brouillon", icon: "document", weight: 1 },
  SENT: { enum: "SENT", text: "Envoyée", icon: "mail", weight: 2 },
  REFUSED: { enum: "REFUSED", text: "Refusée", icon: "thumb-down", weight: 4 },
  PAYMENT_PAID: {
    enum: "PAYMENT_PAID",
    text: "Paiement effectué",
    icon: "check",
    weight: 4,
  },
  TO_DECLARE: {
    enum: "TO_DECLARE",
    text: "A déclarer",
    icon: "receipt-tax",
    weight: 5,
  },
  ARCHIVED: { enum: "ARCHIVED", text: "Archivée", icon: "archive", weight: 6 },
};

export { BILL_STATUS };

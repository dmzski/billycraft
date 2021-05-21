const BILL_STATUS = {
  DRAFT: { enum: "DRAFT", text: "Brouillon", icon: "document", weight: 1 },
  SENT: { enum: "SENT", text: "Envoyé", icon: "mail", weight: 2 },
  REFUSED: { enum: "REFUSED", text: "Refusé", icon: "thumb-down", weight: 4 },
  PAYMENT_PAID: { enum: "PAYMENT_PAID", text: "Paiement effectué", icon: "check", weight: 4 },
  ARCHIVED: { enum: "ARCHIVED", text: "Archivé", icon: "archive", weight: 4 },
};

export { BILL_STATUS };

const BILL_STATUS = {
  DRAFT: { enum: "DRAFT", text: "Brouillon", icon: "create", weight: 1 },
  SENT: { enum: "SENT", text: "Envoyé", icon: "send", weight: 2 },
  ACCEPTED: { enum: "ACCEPTED", text: "Accepté", icon: "thumb_up", weight: 3 },
  REFUSED: { enum: "REFUSED", text: "Refusé", icon: "thumb_down", weight: 4 },
  PAYMENT_ASK: { enum: "PAYMENT_ASK", text: "Paiement demandé", icon: "request_quote", weight: 4 },
  PAYMENT_PAID: { enum: "PAYMENT_PAID", text: "Paiement payé", icon: "done_all", weight: 4 },
  ARCHIVED: { enum: "ARCHIVED", text: "Archivé", icon: "archive", weight: 4 },
};

export { BILL_STATUS };

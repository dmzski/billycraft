const QUOTE_STATUS = {
  DRAFT: { enum: "DRAFT", text: "Brouillon", icon: "document", weight: 1 },
  SENT: { enum: "SENT", text: "Envoyé", icon: "mail", weight: 2 },
  ACCEPTED: { enum: "ACCEPTED", text: "Accepté", icon: "thumb-up", weight: 3 },
  REFUSED: { enum: "REFUSED", text: "Refusé", icon: "thumb-down", weight: 4 },
  DEPOSIT_ASK: { enum: "DEPOSIT_ASK", text: "Acompte demandé", icon: "currency-euro", weight: 4 },
  DEPOSIT_PAID: { enum: "DEPOSIT_PAID", text: "Acompte payé", icon: "check", weight: 4 },
  ARCHIVED: { enum: "ARCHIVED", text: "Archivé", icon: "archive", weight: 4 },
};

export { QUOTE_STATUS };

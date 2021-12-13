import { BillStatusEnum } from 'models/Bill'

type BillStatusObject = {
  enum: string
  text: string
  icon: string
  weight: number
}

const BILL_STATUS: Record<BillStatusEnum, BillStatusObject> = {
  DRAFT: {
    enum: 'DRAFT',
    text: 'Brouillon',
    icon: 'document',
    weight: 1,
  },
  SENT: {
    enum: 'SENT',
    text: 'Envoyée',
    icon: 'mail',
    weight: 2,
  },
  REFUSED: {
    enum: 'REFUSED',
    text: 'Refusée',
    icon: 'thumb-down',
    weight: 4,
  },
  PAYMENT_PAID: {
    enum: 'PAYMENT_PAID',
    text: 'Paiement effectué',
    icon: 'check',
    weight: 4,
  },
  TO_DECLARE: {
    enum: 'TO_DECLARE',
    text: 'A déclarer',
    icon: 'receipt-tax',
    weight: 5,
  },
  ACCEPTED: {
    enum: 'ACCEPTED',
    text: 'Acceptée',
    icon: 'check',
    weight: 6,
  },
  ARCHIVED: {
    enum: 'ARCHIVED',
    text: 'Archivée',
    icon: 'archive',
    weight: 99,
  },
}

export { BILL_STATUS }

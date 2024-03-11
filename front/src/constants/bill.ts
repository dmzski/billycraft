import { BillStatusEnum } from '@/models/Bill'
import { ArchiveBoxArrowDownIcon, CheckIcon, DocumentIcon, EnvelopeIcon, HandThumbDownIcon, ReceiptPercentIcon } from '@heroicons/react/24/solid'
import { ComponentProps, ComponentType } from 'react'

type BillStatusObject = {
  enum: string
  text: string
  icon: ComponentType<ComponentProps<typeof DocumentIcon>>
  weight: number
}

const BILL_STATUS: Record<BillStatusEnum, BillStatusObject> = {
  DRAFT: {
    enum: 'DRAFT',
    text: 'Brouillon',
    icon: DocumentIcon,
    weight: 1,
  },
  SENT: {
    enum: 'SENT',
    text: 'Envoyée',
    icon: EnvelopeIcon,
    weight: 2,
  },
  REFUSED: {
    enum: 'REFUSED',
    text: 'Refusée',
    icon: HandThumbDownIcon,
    weight: 4,
  },
  PAYMENT_PAID: {
    enum: 'PAYMENT_PAID',
    text: 'Paiement effectué',
    icon: CheckIcon,
    weight: 4,
  },
  TO_DECLARE: {
    enum: 'TO_DECLARE',
    text: 'A déclarer',
    icon: ReceiptPercentIcon,
    weight: 5,
  },
  ACCEPTED: {
    enum: 'ACCEPTED',
    text: 'Acceptée',
    icon: CheckIcon,
    weight: 6,
  },
  ARCHIVED: {
    enum: 'ARCHIVED',
    text: 'Archivée',
    icon: ArchiveBoxArrowDownIcon,
    weight: 99,
  },
}

export { BILL_STATUS }

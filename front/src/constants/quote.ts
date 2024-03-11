import { QuoteStatusEnum } from '@/models/Quote'
import { ArchiveBoxArrowDownIcon, CheckIcon, CurrencyEuroIcon, DocumentIcon, EnvelopeIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import { ComponentProps, ComponentType } from 'react'

type QuoteStatusObject = {
  enum: string
  text: string
  icon: ComponentType<ComponentProps<typeof DocumentIcon>>
  weight: number
}

const QUOTE_STATUS: Record<QuoteStatusEnum, QuoteStatusObject> = {
  DRAFT: {
    enum: 'DRAFT',
    text: 'Brouillon',
    icon: DocumentIcon,
    weight: 1,
  },
  SENT: {
    enum: 'SENT',
    text: 'Envoyé',
    icon: EnvelopeIcon,
    weight: 2,
  },
  ACCEPTED: {
    enum: 'ACCEPTED',
    text: 'Accepté',
    icon: HandThumbUpIcon,
    weight: 3,
  },
  REFUSED: {
    enum: 'REFUSED',
    text: 'Refusé',
    icon: HandThumbDownIcon,
    weight: 4,
  },
  DEPOSIT_ASK: {
    enum: 'DEPOSIT_ASK',
    text: 'Acompte demandé',
    icon: CurrencyEuroIcon,
    weight: 4,
  },
  DEPOSIT_PAID: {
    enum: 'DEPOSIT_PAID',
    text: 'Acompte payé',
    icon: CheckIcon,
    weight: 4,
  },
  ARCHIVED: {
    enum: 'ARCHIVED',
    text: 'Archivé',
    icon: ArchiveBoxArrowDownIcon,
    weight: 4,
  },
}

export { QUOTE_STATUS }

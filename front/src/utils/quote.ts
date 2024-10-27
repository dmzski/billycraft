import Quote, { QuoteStatusEnum } from '../models/Quote'

export const isQuoteMinimumAccepted = ({ status }: Quote): boolean =>
  [QuoteStatusEnum.ARCHIVED, QuoteStatusEnum.ACCEPTED, QuoteStatusEnum.DEPOSIT_ASK].includes(status)

import clsx from 'clsx'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useFormatDate } from '@/hooks/useFormatDate'
import { ReportOutgoingResponse, ReportResponse } from '@/models/Report'
import { OUTGOING_ROUTES } from '@/pages/Accountings/Outgoings/constants'
import { ReactNode, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n'

type ReportOutgoingTableProps = {
  report: ReportResponse
}

type OnlyChildrenProps = {
  children: ReactNode
  noBorder?: boolean
}

const DetailsTableRow = ({ children }: { children: ReactNode }) => (
  <dl className="grid md:grid-cols-12">{children}</dl>
)

const DetailsTableLeft = ({ children, noBorder }: OnlyChildrenProps) => (
  <dt className={clsx('md:col-span-6 p-2 bg-base-300', noBorder ? '' : 'border-b')}>{children}</dt>
)

const DetailsTableRight = ({ children, noBorder }: OnlyChildrenProps) => (
  <dd className={clsx('md:col-span-6 p-2', noBorder ? '' : 'border-b')}>{children}</dd>
)

const ReportOutgoingTable = ({ report }: ReportOutgoingTableProps) => {
  const { t } = useI18n()
  const formatCurrency = useFormatCurrency()
  const { toISO9075 } = useFormatDate()

  const getTotal = useCallback(
    (outgoing: ReportOutgoingResponse) =>
      outgoing?.lines
        ? outgoing.lines.reduce((acc, line) => acc + line.totalHT * (1 - line.vat), 0)
        : 0,
    [],
  )
  return (
    <div className="flex flex-col gap-4">
      {report.outgoings.map(outgoing => (
        <article className="md:ml-2 border rounded">
          <div className="flex flex-col gap-2 md:gap-0">
            <DetailsTableRow>
              <DetailsTableLeft>
                {t('accounting.reports.components.outgoing.headers.name')}
              </DetailsTableLeft>
              <DetailsTableRight>
                <Link to={OUTGOING_ROUTES.routes.DETAILS.path({id: outgoing.outgoingId})}>
                  {outgoing.name}
                </Link>
              </DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft>
                {t('accounting.reports.components.outgoing.headers.startDate')}
              </DetailsTableLeft>
              <DetailsTableRight>{toISO9075(outgoing.startDate)}</DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft>
                {t('accounting.reports.components.outgoing.headers.endDate')}
              </DetailsTableLeft>
              <DetailsTableRight>{toISO9075(outgoing.endDate)}</DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft>
                {t('accounting.reports.components.outgoing.headers.createdBy')}
              </DetailsTableLeft>
              <DetailsTableRight>{outgoing.createdBy}</DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft noBorder>
                {t('accounting.reports.components.outgoing.headers.itTotal')}
              </DetailsTableLeft>
              <DetailsTableRight noBorder>{formatCurrency(getTotal(outgoing))}</DetailsTableRight>
            </DetailsTableRow>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ReportOutgoingTable

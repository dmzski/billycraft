import { useFormatCurrency } from 'hooks/useFormatCurrency'
import { useFormatDate } from 'hooks/useFormatDate'
import { ReportOutgoingResponse, ReportResponse } from 'models/Report'
import { OUTGOING_ROUTES } from 'pages/Accountings/Outgoings/constants'
import { ReactNode, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { injectIdInPath } from 'routes'

type ReportOutgoingTableProps = {
  report: ReportResponse
}

type OnlyChildrenProps = {
  children: ReactNode
}

const DetailsTableRow = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dl className="grid md:grid-cols-12">{children}</dl>
)

const DetailsTableLeft = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dt className="md:col-span-6 border p-2 bg-primary-50 text-primary-700">{children}</dt>
)

const DetailsTableRight = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dd className="md:col-span-6 p-2 border border-t-0 md:border-l-0 md:border-t">{children}</dd>
)

const ReportOutgoingTable = ({ report }: ReportOutgoingTableProps): JSX.Element => {
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
        <article className="md:ml-2 border shadow">
          <div className="flex flex-col gap-2 md:gap-0">
            <DetailsTableRow>
              <DetailsTableLeft>Nom du livret</DetailsTableLeft>
              <DetailsTableRight>
                <Link
                  className="text-lg font-semibold underline text-primary-700"
                  to={injectIdInPath(OUTGOING_ROUTES.routes.DETAILS.path, outgoing.outgoingId)}
                >
                  {outgoing.name}
                </Link>
              </DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft>Date de début</DetailsTableLeft>
              <DetailsTableRight>{toISO9075(outgoing.startDate)}</DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft>Date de fin</DetailsTableLeft>
              <DetailsTableRight>{toISO9075(outgoing.endDate)}</DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft>Créé par</DetailsTableLeft>
              <DetailsTableRight>{outgoing.createdBy}</DetailsTableRight>
            </DetailsTableRow>
            <DetailsTableRow>
              <DetailsTableLeft>Total TTC</DetailsTableLeft>
              <DetailsTableRight>{formatCurrency(getTotal(outgoing))}</DetailsTableRight>
            </DetailsTableRow>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ReportOutgoingTable

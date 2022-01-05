import { ReportResponse } from 'models/Report'
import { OUTGOING_ROUTES } from 'pages/Accountings/Outgoings/constants'
import OutgoingDetail from 'pages/Accountings/Outgoings/Details/OutgoingDetail'
import { Link } from 'react-router-dom'
import { injectIdInPath } from 'routes'

type ReportOutgoingTableProps = {
  report: ReportResponse
}

const ReportOutgoingTable = ({ report }: ReportOutgoingTableProps): JSX.Element => (
  <div className="flex flex-col gap-4">
    {report.outgoings.map(outgoing => (
      <article>
        <Link
          className="text-lg font-semibold underline text-primary-700"
          to={injectIdInPath(OUTGOING_ROUTES.routes.DETAILS.path, outgoing.outgoingId)}
        >
          {outgoing.name}
        </Link>
        <OutgoingDetail outgoing={outgoing} />
      </article>
    ))}
  </div>
)

export default ReportOutgoingTable

import { useFormatDate } from '@/hooks/useFormatDate'
import { ReportResponse } from '@/models/Report'
import { Link } from 'react-router-dom'
import { injectIdInPath } from '@/routes'
import { REPORT_ROUTES } from '../constants'
import { useI18n } from '@/i18n'

type ReportRowProps = {
  report: ReportResponse
}
const ReportRow = ({ report }: ReportRowProps) => {
  const { toISO9075 } = useFormatDate()
  return (
    <div className="grid md:grid-cols-12 p-2 border-t">
      <div className="md:col-span-3">
        <Link
          className="link-primary"
          to={injectIdInPath(REPORT_ROUTES.routes.DETAILS.path, report.id)}
        >
          {report.name}
        </Link>
      </div>
      <div className="md:col-span-3">{toISO9075(report.startDate)}</div>
      <div className="md:col-span-3">{toISO9075(report.endDate)}</div>
      <div className="md:col-span-3">{toISO9075(report.createdAt)}</div>
    </div>
  )
}

type ListProps = {
  reports: ReportResponse[]
}
const List = ({ reports }: ListProps) => {
  const { t } = useI18n()

  return (
    <div className="flex flex-col border rounded">
      <div className="grid md:grid-cols-12 py-4 px-2 gap-2 bg-base-300">
        <div className="md:col-span-3">{t('accounting.reports.components.list.headers.name')}</div>
        <div className="md:col-span-3">
          {t('accounting.reports.components.list.headers.startDate')}
        </div>
        <div className="md:col-span-3">
          {t('accounting.reports.components.list.headers.endDate')}
        </div>
        <div className="md:col-span-3">
          {t('accounting.reports.components.list.headers.createdAt')}
        </div>
      </div>
      {reports.map(report => (
        <ReportRow key={report.id} report={report} />
      ))}
    </div>
  )
}

export default List

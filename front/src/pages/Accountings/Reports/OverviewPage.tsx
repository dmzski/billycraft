import { useMemo } from 'react'
import ReportTable from './components/ReportTable'
import { useI18n } from '@/i18n'
import { useReportByYearQuery } from '@/queries/useReportByYearQuery'
import { useReportByMonthQuery } from '@/queries/useReportByMonthQuery'

const OverviewPage = () => {
  const { t } = useI18n()
  const currentDate = useMemo(() => Date.now(), [])
  const { data: monthData } = useReportByMonthQuery(currentDate)
  const { data: yearData } = useReportByYearQuery(currentDate)

  const currentMonth = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
        .format(Date.now())
        .toLocaleUpperCase(),
    [],
  )

  return (
    <div>
      <div className="mb-4 p-2 border-b grid md:grid-cols-12 gap-4 items-center">
        <h2 className="text-xl col-span-full">
          {t('accounting.overview.currentMonth')}
          {currentMonth}
        </h2>
      </div>
      {monthData ? <ReportTable report={monthData} /> : null}
      <div className="my-4 p-2 border-b grid md:grid-cols-12 gap-4 items-center">
        <h2 className="text-xl col-span-full">{t('accounting.overview.currentYear')}</h2>
      </div>
      {yearData ? <ReportTable report={yearData} /> : null}
    </div>
  )
}

export default OverviewPage

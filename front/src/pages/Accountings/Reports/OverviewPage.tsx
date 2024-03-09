import { ReportApi } from '@/api/ReportApi'
import { useMemo } from 'react'
import ReportTable from './components/ReportTable'
import { useDataLoader } from '@scaleway/use-dataloader'

const OverviewPage = () => {
  const { data: monthData } = useDataLoader(
    ['reports', 'current-month'],
    () => ReportApi.getMonthReport(Date.now()),
  )

  const { data: yearData } = useDataLoader(
    ['reports', 'current-year'],
    () => ReportApi.getYearReport(Date.now()),
  )

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
        <h2 className="text-xl col-span-full">Mois en cours : {currentMonth}</h2>
      </div>
      {monthData ? <ReportTable report={monthData} /> : null}
      <div className="my-4 p-2 border-b grid md:grid-cols-12 gap-4 items-center">
        <h2 className="text-xl col-span-full">Année en cours</h2>
      </div>
      {yearData ? <ReportTable report={yearData} /> : null}
    </div>
  )
}

export default OverviewPage

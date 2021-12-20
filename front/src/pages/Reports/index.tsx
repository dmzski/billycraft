import { useState } from 'react'
import { useQuery } from 'react-query'
import Loader from '../../components/Loader'
import ReportCards from './ReportCards'
import YearReportGraph from './YearReportGraph'
import { ReportApi } from '../../api/ReportApi'
import { ReportDTO } from '../../models/dtos/Report'

const Reports = () => {
  const [dateTarget] = useState(new Date())
  const { data: monthData, isLoading: isLoadingMonth } = useQuery(
    ['month-report', dateTarget],
    () => ReportApi.getMonthReport(dateTarget),
    {
      refetchOnWindowFocus: false,
    },
  )
  const { data: yearData, isLoading: isLoadingYear } = useQuery<ReportDTO>(
    ['year-report', dateTarget],
    () => ReportApi.getYearReport(dateTarget),
    {
      refetchOnWindowFocus: false,
    },
  )

  return (
    <div>
      <h2 className="text-xl mt-10">Rapport du mois en cours</h2>
      <div className="flex flex-col justify-center items-center">
        {isLoadingMonth ? (
          <div>
            <Loader />
          </div>
        ) : null}
        {!isLoadingMonth && monthData ? <ReportCards report={monthData} /> : null}
      </div>
      <h2 className="mt-10 text-xl">Rapport de l&apos;année en cours</h2>
      <div className="px-4 flex flex-col justify-center items-center">
        {isLoadingYear ? (
          <div>
            <Loader />
          </div>
        ) : null}
        {!isLoadingYear && yearData ? (
          <>
            <ReportCards report={yearData} />
            <YearReportGraph report={yearData} />
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Reports

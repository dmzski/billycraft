import { Button, Loader } from '@coco-ui/core'
import { ReportApi } from 'api/ReportApi'
import { useFormatDate } from 'hooks/useFormatDate'
import { ReportRequest } from 'models/Report'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import ReportOutgoingTable from './components/ReportOutgoingTable'
import ReportTable from './components/ReportTable'
import { REPORT_ROUTES } from './constants'

type DetailTableProps = {
  report: ReportRequest
}
const DetailTable = ({ report }: DetailTableProps) => {
  const { toISO9075 } = useFormatDate()
  return (
    <div className="flex flex-col gap-2 md:gap-0">
      <dl className="grid md:grid-cols-12">
        <dt className="border p-2 md:col-span-2 bg-primary-50 text-primary-700 md:border-b-0">
          Nom du rapport
        </dt>
        <dd className="md:col-span-10 border md:border-l-0 border-t-0 md:border-t p-2 md:border-b-0">
          {report.name}
        </dd>
      </dl>
      <dl className="grid md:grid-cols-12">
        <dt className="border p-2 md:col-span-2 bg-primary-50 text-primary-700 md:border-b-0">
          Date de début
        </dt>
        <dd className="md:col-span-10 border md:border-l-0 border-t-0 md:border-t p-2 md:border-b-0">
          {toISO9075(report.startDate)}
        </dd>
      </dl>
      <dl className="grid md:grid-cols-12">
        <dt className="border p-2 md:col-span-2 bg-primary-50 text-primary-700">Date de fin</dt>
        <dd className="md:col-span-10 border md:border-l-0 border-t-0 md:border-t p-2">
          {toISO9075(report.endDate)}
        </dd>
      </dl>
    </div>
  )
}
const DetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: report, isLoading } = useQuery(['reports', id], () => ReportApi.findById(id), {
    refetchOnWindowFocus: false,
    staleTime: 6000,
  })

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <Link to={REPORT_ROUTES.routes.LIST.path}>
        <Button
          type="button"
          className="md:w-auto w-full mb-4"
          variant="inverted-primary"
          icon="arrow-left"
          iconSize={12}
          size="xs"
        >
          Retourner à la liste des rapports
        </Button>
      </Link>
      {report ? (
        <>
          <h1 className="text-2xl text-primary-700 border-b mb-4">{report.name}</h1>
          <section className="md:ml-2">
            <h2 className="text-xl mb-2">Vue d&apos;ensemble</h2>
            <DetailTable report={report} />
          </section>
          <hr className="my-4" />
          <section className="md:ml-2">
            <h2 className="text-xl mb-2">Détails</h2>
            <ReportTable report={report} />
          </section>
          <hr className="my-4" />
          <section className="md:ml-2">
            <h2 className="text-xl mb-2">Détails des livret d&apos;achats</h2>
            <ReportOutgoingTable report={report} />
          </section>
        </>
      ) : (
        <div>Une erreur est survenue</div>
      )}
    </>
  )
}

export default DetailsPage

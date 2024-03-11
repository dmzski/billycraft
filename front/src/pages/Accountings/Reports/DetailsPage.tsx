import { Button, Loader, useToast } from '@coco-ui/core'
import { ReportApi } from '@/api/ReportApi'
import { STRINGS } from '@/constants/strings'
import { useFormatDate } from '@/hooks/useFormatDate'
import { ReportRequest } from '@/models/Report'
import { useCallback, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import ReportOutgoingTable from './components/ReportOutgoingTable'
import ReportPerSupplierTable from './components/ReportPerSupplierTable'
import ReportTable from './components/ReportTable'
import { REPORT_ROUTES } from './constants'
import DeleteModal from './modals/DeleteModal'
import { useDataLoader, useDataLoaderContext } from '@scaleway/use-dataloader'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

type DetailTableProps = {
  report: ReportRequest
}
const DetailTable = ({ report }: DetailTableProps) => {
  const { toISO9075 } = useFormatDate()
  return (
    <div className="flex flex-col gap-2 md:gap-0 border rounded">
      <dl className="grid md:grid-cols-12">
        <dt className="p-2 md:col-span-2 bg-base-300 border-b">Nom du rapport</dt>
        <dd className="md:col-span-10 border-b p-2">{report.name}</dd>
      </dl>
      <dl className="grid md:grid-cols-12">
        <dt className="p-2 md:col-span-2 bg-base-300 border-b">Date de début</dt>
        <dd className="md:col-span-10 p-2 border-b">{toISO9075(report.startDate)}</dd>
      </dl>
      <dl className="grid md:grid-cols-12">
        <dt className="p-2 md:col-span-2 bg-base-300">Date de fin</dt>
        <dd className="md:col-span-10 p-2">{toISO9075(report.endDate)}</dd>
      </dl>
    </div>
  )
}
const DetailsPage = () => {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const toast = useToast()
  const { push } = useHistory()
  const { id } = useParams<{ id: string }>()
  const { reload } = useDataLoaderContext()
  const { data: report, isLoading } = useDataLoader(['reports', id], () => ReportApi.findById(id))

  const openDeleteModal = useCallback(() => {
    setDeleteOpen(true)
  }, [])

  const onDelete = useCallback(async () => {
    try {
      await ReportApi.delete(id)
      toast.success(STRINGS.DELETE_SUCCESS)
      push(REPORT_ROUTES.routes.LIST.path)
      reload('reports')
    } catch {
      toast.error(STRINGS.DELETE_ERROR)
    }
  }, [id, toast, push, reload])

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <div className="flex md:justify-between flex-col md:flex-row">
        <Link to={REPORT_ROUTES.routes.LIST.path}>
          <Button type="button" className="md:w-auto w-full mb-4" variant="ghost">
            <ArrowLeftIcon className='w-5' />
            &nbsp; Retourner à la liste des rapports
          </Button>
        </Link>
        <Button className="mb-4" variant="error" outline onClick={openDeleteModal}>
          Supprimer
        </Button>
        <DeleteModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onSubmit={onDelete} />
      </div>
      {report ? (
        <>
          <h1 className="text-2xl border-b mb-4">{report.name}</h1>
          <div className="flex flex-col gap-8">
            <section className="md:ml-2">
              <h2 className="text-xl mb-2">Vue d&apos;ensemble</h2>
              <DetailTable report={report} />
            </section>
            <section className="md:ml-2">
              <h2 className="text-xl mb-2">Détails</h2>
              <ReportTable report={report} />
            </section>
            <section className="md:ml-2">
              <h2 className="text-xl mb-2">Détails des dépenses par fournisseur</h2>
              <ReportPerSupplierTable report={report} />
            </section>
            <section className="md:ml-2">
              <h2 className="text-xl mb-2">Détails des livret d&apos;achats</h2>
              <ReportOutgoingTable report={report} />
            </section>
          </div>
        </>
      ) : (
        <div>Une erreur est survenue</div>
      )}
    </>
  )
}

export default DetailsPage

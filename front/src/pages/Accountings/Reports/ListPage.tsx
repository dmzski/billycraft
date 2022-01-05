import { Button } from '@coco-ui/core'
import { ReportApi } from 'api/ReportApi'
import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import List from './components/List'
import CreateReportModal from './modals/CreateReportModal'

const ListPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const { data, refetch } = useQuery(['reports', 'all'], ReportApi.findAll, {
    refetchOnWindowFocus: false,
  })
  const handleCreate = useCallback(() => {
    setOpenModal(true)
  }, [])

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row pb-2 mb-4 border-b">
        <h2 className="text-2xl flex-grow">Rapports</h2>
        <Button onClick={handleCreate}>Créer un rapport</Button>
        <CreateReportModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmitSuccess={() => {
            refetch()
          }}
        />
      </div>
      {data ? (
        <div>
          <List reports={data} />
        </div>
      ) : null}
    </div>
  )
}

export default ListPage

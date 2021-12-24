import { Button } from '@coco-ui/core'
import { useCallback, useState } from 'react'
import CreateReportModal from './modals/CreateReportModal'

const ListPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const handleCreate = useCallback(() => {
    setOpenModal(true)
  }, [])

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row pb-2 mb-4 border-b">
        <h2 className="text-2xl flex-grow">Rapports</h2>
        <Button onClick={handleCreate}>Créer un rapport</Button>
      </div>
      <CreateReportModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  )
}

export default ListPage

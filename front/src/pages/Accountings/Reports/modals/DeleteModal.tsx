import { Button, Modal } from '@coco-ui/core'

type DeleteModalProps = {
  isOpen?: boolean
  onClose: () => void
  onSubmit?: () => void | Promise<void>
}

const DeleteModal = ({ onClose, isOpen, onSubmit }: DeleteModalProps) => (
  <Modal onClose={onClose} open={isOpen}>
    <div className="w-full">
      <h2 className="text-error-600 text-xl font-bold border-b mb-4 pb-2">Supprimer un rapport</h2>
      <p className="mb-2">Êtes-vous sûr de vouloir supprimer ce rapport ?</p>
      <p className="font-bold">
        Cette action est irréversible est vos données seront définitivement supprimées.
      </p>
      <Button onClick={onSubmit} variant="error" className="w-full mt-4">
        Supprimer
      </Button>
    </div>
  </Modal>
)

export default DeleteModal

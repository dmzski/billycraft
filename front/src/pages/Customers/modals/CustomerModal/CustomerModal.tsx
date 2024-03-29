import { Modal } from '@coco-ui/core'
import Customer from '@/models/Customer'
import CustomerForm from './Form'

type CustomerModalProps = {
  customer?: Customer
  disclosure: JSX.Element
  onSubmitSuccess: () => Promise<void>
}
const CustomerModal = ({ customer, disclosure, onSubmitSuccess }: CustomerModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <CustomerForm
        customer={customer}
        onSubmitSuccess={async () => {
          await onSubmitSuccess?.()
          close()
        }}
      />
    )}
  </Modal>
)

export default CustomerModal

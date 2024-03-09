import { Modal } from '@coco-ui/core'
import Customer from '../../../models/Customer'
import CustomerForm from '../Form/Form'
import { useDataLoaderContext } from '@scaleway/use-dataloader'

type CustomerModalProps = {
  customer?: Customer
  disclosure: JSX.Element
}
const CustomerModal = ({ customer, disclosure }: CustomerModalProps) => {
  const {reload} = useDataLoaderContext()

  const onSubmitSuccess = () => {
    reload('customers')
  }

  return (
    <Modal disclosure={disclosure}>
      {({ close }) => (
        <CustomerForm customer={customer} onSubmitSuccess={() => {
          close()
          onSubmitSuccess()
        }} />
      )}
    </Modal>
  )
}

export default CustomerModal

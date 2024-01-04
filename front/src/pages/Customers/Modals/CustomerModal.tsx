import { Modal } from '@coco-ui/core'
import { useQueryCache } from 'react-query'
import Customer from '../../../models/Customer'
import CustomerForm from '../Form/Form'

type CustomerModalProps = {
  customer?: Customer
  disclosure: JSX.Element
}
const CustomerModal = ({ customer, disclosure }: CustomerModalProps): JSX.Element => {
  const queryCache = useQueryCache()

  const onSubmitSuccess = () => {
    queryCache.invalidateQueries('customers')
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

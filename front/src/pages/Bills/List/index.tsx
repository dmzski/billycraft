import { useTableState } from '@coco-ui/core'
import useCustomers from '@/hooks/useCustomers'
import Bill from '@/models/Bill'
import BillTableLine from './Row'

const BillList = ({ data }: { data: Bill[] }) => {
  const customers = useCustomers()
  const { data: bills } = useTableState({
    data,
    initialSort: { field: 'createdAt', order: 'desc' },
  })

  return (
    <div className="flex flex-col">
      <div className="p-4 grid md:grid-cols-12 bg-base-300 border-b rounded-t">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Titre</div>
        <div className="col-span-2">Client</div>
        <div className="col-span-2">Création</div>
        <div className="col-span-2">Envoyé</div>
        <div className="col-span-2">Status</div>
      </div>
      <div className="flex flex-col">
        {bills.map(bill => (
          <BillTableLine
            customer={customers.find(c => c.id === bill.customerId)}
            key={bill.id}
            bill={bill}
          />
        ))}
      </div>
    </div>
  )
}

export default BillList

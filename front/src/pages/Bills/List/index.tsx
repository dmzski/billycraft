import { Table, useTableState } from '@coco-ui/core'
import useCustomers from 'hooks/useCustomers'
import Bill from 'models/Bill'
import BillTableLine from './Row'

const BillList = ({ data }: { data: Bill[] }): JSX.Element => {
  const customers = useCustomers()
  const { sort, onSort, data: bills } = useTableState({
    data,
    initialSort: { field: 'createdAt', order: 'desc' },
  })

  return (
    <Table className="text-left overlay-x-auto w-full table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="w-1/4 pl-2" sort={sort} sortable="title" onSort={onSort}>
            Titre
          </Table.HeadCell>
          <Table.HeadCell className="w-1/4" sort={sort} sortable="customer" onSort={onSort}>
            Client
          </Table.HeadCell>
          <Table.HeadCell className="w-56" sort={sort} sortable="createdAt" onSort={onSort}>
            Création
          </Table.HeadCell>
          <Table.HeadCell className="w-64" sort={sort} sortable="sentAt" onSort={onSort}>
            Envoyé
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="total" onSort={onSort}>
            Total
          </Table.HeadCell>
          <Table.HeadCell className="w-52" sort={sort} sortable="status" onSort={onSort}>
            Status
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {bills.map(bill => (
          <BillTableLine
            customer={customers.find(c => c.id === bill.customerId)}
            key={bill.id}
            bill={bill}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

export default BillList

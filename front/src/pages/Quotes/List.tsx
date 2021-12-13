import { Table, useTableState } from '@coco-ui/core'
import useCustomers from 'hooks/useCustomers'
import Quote from 'models/Quote'
import QuoteTableLine from './Row'

type QuoteListProps = {
  data: Quote[]
}
const QuoteList = ({ data }: QuoteListProps): JSX.Element => {
  const { data: quotes, sort, onSort } = useTableState({
    data,
    initialSort: { field: 'createdAt', order: 'desc' },
  })
  const customers = useCustomers()

  return (
    <Table className="w-full table-fixed text-left">
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="pl-2 w-1/3 py-3" sort={sort} sortable="title" onSort={onSort}>
            Titre
          </Table.HeadCell>
          <Table.HeadCell className="w-1/4" sort={sort} sortable="customer" onSort={onSort}>
            Client
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="createdAt" onSort={onSort}>
            Création
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="sentAt" onSort={onSort}>
            Envoyé
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="total" onSort={onSort}>
            Total
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="status" onSort={onSort}>
            Status
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {quotes.map(quote => (
          <QuoteTableLine
            customer={customers.find(c => c.id === quote.customerId)}
            key={quote.id}
            quote={quote}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

export default QuoteList

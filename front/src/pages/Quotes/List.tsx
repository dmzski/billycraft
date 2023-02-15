import useCustomers from 'hooks/useCustomers'
import Quote from 'models/Quote'
import QuoteTableLine from './Row'

type QuoteListProps = {
  data: Quote[]
}
const QuoteList = ({ data }: QuoteListProps): JSX.Element => {
  const customers = useCustomers()

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
        {data.map(quote => (
          <QuoteTableLine
            customer={customers.find(c => c.id === quote.customerId)}
            key={quote.id}
            quote={quote}
          />
        ))}
      </div>
    </div>
  )
}

export default QuoteList

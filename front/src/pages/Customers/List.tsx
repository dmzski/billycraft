import Customer from 'models/Customer'
import CustomerTableLine from './ListRow'

const CustomerTable = ({ data = [] }: { data: Customer[] }): JSX.Element => (
  <div className="mt-2 flex flex-col">
    <div className="px-2 py-4 grid md:grid-cols-12 bg-base-200 border-b rounded-t">
      <div className="md:col-span-3">Nom</div>
      <div className="md:col-span-3">Contact</div>
      <div className="md:col-span-3">Téléphone</div>
      <div className="md:col-span-3">Email</div>
    </div>
    <div>
      {data.map((customer, index) => (
        <CustomerTableLine key={customer.id} index={index} customer={customer} />
      ))}
    </div>
  </div>
)

export default CustomerTable

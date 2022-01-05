import { OutgoingLineResponse } from 'models/Outgoing'
import Row from './Row'

type OutgoingTableProps = {
  lines: OutgoingLineResponse[]
}
const OutgoingLinesTable = ({ lines }: OutgoingTableProps): JSX.Element => (
  <div className="border rounded">
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-primary-700 items-center bg-primary-50 border-b p-4 px-4">
      <div className="col-span-2">Fournisseur *</div>
      <div className="col-span-2">Référence facture *</div>
      <div className="col-span-2">Facture liée</div>
      <div className="col-span-2">Total HT *</div>
      <div className="col-span-2">TVA</div>
      <div className="col-span-2">Total TTC</div>
    </div>
    <div className="flex flex-col">
      {lines.map(line => (
        <Row key={line.line} line={line} />
      ))}
    </div>
  </div>
)

export default OutgoingLinesTable

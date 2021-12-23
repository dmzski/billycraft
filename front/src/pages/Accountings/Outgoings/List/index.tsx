import { OutgoingResponse } from 'models/Outgoing'
import React from 'react'
import Row from './Row'

type ListProps = {
  data?: OutgoingResponse[]
}
const List = ({ data }: ListProps): JSX.Element => (
  <div>
    <div className="grid sm:grid-cols-12 gap-4 text-primary-700 bg-primary-50 p-4 rounded-t">
      <div className="col-span-3">Nom</div>
      <div className="col-span-3">Date de début</div>
      <div className="col-span-3">Date de fin</div>
      <div className="col-span-3">Total</div>
    </div>
    {data && data.length > 0 ? (
      <div>
        {data.map(outgoing => (
          <Row outgoing={outgoing} key={outgoing.id} />
        ))}
      </div>
    ) : (
      <div>Aucun livret enregistré</div>
    )}
  </div>
)

export default List

import { formatISO9075, parseJSON } from 'date-fns'
import { OutgoingResponse } from 'models/Outgoing'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

type RowProps = {
  outgoing: OutgoingResponse
}
const Row = ({ outgoing }: RowProps): JSX.Element => {
  const total = useMemo(
    () =>
      new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(
        outgoing.lines.reduce((acc, { totalHT, vat }) => acc + totalHT * (1 - vat), 0),
      ),
    [outgoing.lines],
  )
  return (
    <div className="grid sm:grid-cols-12 gap-4 px-4 py-4 border-b shadow my-2 rounded">
      <div className="col-span-3 truncate">
        <Link to="/" className="text-primary-700 underline">
          {outgoing.name}
        </Link>
      </div>
      <div className="col-span-3">
        {formatISO9075(parseJSON(outgoing.startDate), { representation: 'date' })}
      </div>
      <div className="col-span-3">
        {formatISO9075(parseJSON(outgoing.endDate), { representation: 'date' })}
      </div>
      <div className="col-span-3">{total}</div>
    </div>
  )
}

export default Row

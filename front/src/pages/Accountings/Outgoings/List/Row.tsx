import { formatISO9075, parseJSON } from 'date-fns'
import { OutgoingResponse } from '@/models/Outgoing'
import { useMemo } from 'react'
import { ROUTES } from '@/routes'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { RRLink } from '@/components/RRLink'

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

type RowProps = {
  outgoing: OutgoingResponse
}

const Row = ({ outgoing }: RowProps) => {
  const formatCurrency = useFormatCurrency()

  const total = useMemo(
    () =>
      formatCurrency(
        outgoing.lines.reduce(
          (acc, { totalHT = 0, vat = 0 }) => acc + totalHT * (1 + vat / 100),
          0,
        ),
      ),
    [outgoing.lines, formatCurrency],
  )
  return (
    <div className="grid md:grid-cols-12 gap-4 p-4">
      <div className="md:col-span-3 truncate">
        <RRLink to={routes.DETAILS.path({ id: outgoing.id })}>{outgoing.name}</RRLink>
      </div>
      <div className="md:col-span-3">
        {formatISO9075(parseJSON(outgoing.startDate), { representation: 'date' })}
      </div>
      <div className="md:col-span-3">
        {formatISO9075(parseJSON(outgoing.endDate), { representation: 'date' })}
      </div>
      <div className="md:col-span-3">{total}</div>
    </div>
  )
}

export default Row

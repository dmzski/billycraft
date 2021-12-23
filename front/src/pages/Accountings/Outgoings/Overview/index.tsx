import { Badge, Icon } from '@coco-ui/core'
import { OutgoingApi } from 'api/OutgoingApi'
import { formatRFC3339 } from 'date-fns'
import { OutgoingResponse } from 'models/Outgoing'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import OutgoingForm from '../Form'

const Overview = () => {
  const { data, refetch } = useQuery(['outgoings', 'current'], OutgoingApi.findCurrent, {
    refetchOnWindowFocus: false,
  })

  const currentMonth = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
        .format(Date.now())
        .toLocaleUpperCase(),
    [],
  )

  const defaultOutgoingOverview = useMemo(
    () => ({ name: currentMonth, startDate: formatRFC3339(Date.now()) } as OutgoingResponse),
    [currentMonth],
  )

  const total = useMemo(
    () =>
      data
        ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(
            data.lines.reduce((acc, { totalHT = 0, vat = 0 }) => acc + totalHT * (1 - vat), 0),
          )
        : null,
    [data],
  )

  return (
    <div>
      <div className="mb-4 p-2 border-b grid md:grid-cols-12 gap-4 items-center">
        <h2 className="text-xl md:col-span-9">Mois en cours : {currentMonth}</h2>
        <div className="flex flex-col md:flex-row md:justify-end border rounded md:col-span-3">
          <div className="text-primary-700 bg-primary-50 p-2 w-full md:w-auto">
            Total des dépenses du mois :
          </div>
          <div className="flex-grow p-2 text-lg text-right">{total}</div>
        </div>
      </div>
      <OutgoingForm
        onSubmitSuccess={() => {
          refetch()
        }}
        disabledFields={['startDate']}
        outgoing={data ?? defaultOutgoingOverview}
      />
    </div>
  )
}

export default Overview

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

  return (
    <div>
      <div className="mb-4 p-2 border-b">
        <h2 className="text-xl">Mois en cours : {currentMonth}</h2>
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

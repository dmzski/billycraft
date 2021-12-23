import { OutgoingApi } from 'api/OutgoingApi'
import { formatRFC3339, isSameMonth, parseJSON } from 'date-fns'
import { OutgoingResponse } from 'models/Outgoing'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import OutgoingForm from '../Form'

const Overview = () => {
  const { data, refetch } = useQuery(['outgoings', 'overview'], OutgoingApi.findAll, {
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

  const currentOutgoing = useMemo(
    () => data?.find(({ startDate }) => isSameMonth(parseJSON(startDate), Date.now())),
    [data],
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
        outgoing={currentOutgoing ?? defaultOutgoingOverview}
      />
    </div>
  )
}

export default Overview

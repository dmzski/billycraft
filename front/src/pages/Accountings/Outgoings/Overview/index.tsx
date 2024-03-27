import { formatRFC3339 } from 'date-fns'
import { OutgoingResponse } from '@/models/Outgoing'
import { useMemo } from 'react'
import OutgoingForm from '../Form'
import { useI18n } from '@/i18n'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useOutgoingCurrentQuery } from '@/queries/useOutgoingCurrentQuery'

const Overview = () => {
  const { t } = useI18n()
  const formatCurrency = useFormatCurrency()
  const { data, reload } = useOutgoingCurrentQuery()

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
        ? formatCurrency(
            data.lines.reduce(
              (acc, { totalHT = 0, vat = 0 }) => acc + totalHT * (1 + vat / 100),
              0,
            ),
          )
        : null,
    [data, formatCurrency],
  )

  return (
    <div>
      <div className="mb-4 p-2 border-b grid md:grid-cols-12 gap-4 items-center">
        <h2 className="text-xl md:col-span-9">
          {t('accounting.outgoings.pages.overview.currentMonth')}
          {currentMonth}
        </h2>
        <div className="flex flex-col md:flex-row md:justify-end border rounded md:col-span-3">
          <div className="text-primary-700 bg-primary-50 p-2 w-full md:w-auto">
            {t('accounting.outgoings.pages.overview.totalThisMonth')}
          </div>
          <div className="flex-grow p-2 text-lg text-right">{total}</div>
        </div>
      </div>
      <OutgoingForm
        onSubmitSuccess={() => {
          reload()
        }}
        disabledFields={['startDate']}
        outgoing={data ?? defaultOutgoingOverview}
      />
    </div>
  )
}

export default Overview

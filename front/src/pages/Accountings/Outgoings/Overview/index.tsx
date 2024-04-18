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
        : formatCurrency(0),
    [data, formatCurrency],
  )

  return (
    <div className="flex flex-col gap-10">
      <div className="p-2 flex gap-4 items-center">
        <h2 className="text-2xl flex-grow">
          {t('accounting.outgoings.pages.overview.currentMonth')}
          {currentMonth}
        </h2>
        <div className="flex items-center border border-primary rounded bg-primary-content text-primary p-4">
          <p>{t('accounting.outgoings.pages.overview.totalThisMonth')}</p>
          <p className="flex-grow">{total}</p>
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

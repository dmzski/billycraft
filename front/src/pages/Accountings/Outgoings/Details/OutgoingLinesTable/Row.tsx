import { BillApi } from '@/api/BillApi'
import { SupplierApi } from '@/api/SupplierApi'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useI18n } from '@/i18n'
import { OutgoingLineResponse } from '@/models/Outgoing'
import { useDataLoader } from '@scaleway/use-dataloader'
import { useMemo } from 'react'

const DEFAULT_LINE_COLOR = 'initial'

type RowProps = {
  line: OutgoingLineResponse
}
const Row = ({
  line: { totalHT, vat, billId, supplierBillReference, supplierId },
}: RowProps) => {
  const formatCurrency = useFormatCurrency()
  const { data: bills } = useDataLoader(['bills'],() => BillApi.findAll())
  const { data: suppliers } = useDataLoader(['suppliers'], () => SupplierApi.findAll())
  const {t} = useI18n()

  const totalTTC = useMemo(
    () =>
      !Number.isNaN(totalHT) && !Number.isNaN(vat)
        ? formatCurrency(Number(totalHT * (1 + vat / 100)) || 0)
        : '',
    [totalHT, vat, formatCurrency],
  )

  const bill = useMemo(() => {
    if (bills) return bills.find(({ id }) => id === billId)

    return undefined
  }, [billId, bills])

  const supplier = useMemo(() => {
    if (suppliers) return suppliers?.find(({ id }) => id === supplierId)

    return undefined
  }, [supplierId, suppliers])

  const lineColor = useMemo(() => {
    if (supplierId && suppliers) {
      return suppliers.find(({ id }) => id === supplierId)?.color ?? DEFAULT_LINE_COLOR
    }

    return DEFAULT_LINE_COLOR
  }, [supplierId, suppliers])

  return (
    <div
      style={{ backgroundColor: lineColor }}
      className="py-2 px-4 grid grid-cols-1 md:grid-cols-12 items-center gap-4 border-b"
    >
      <div className="md:col-span-2">{supplier?.name ?? t('accounting.outgoings.details.lines.defaultSupplier')}</div>
      <div className="md:col-span-2">{supplierBillReference}</div>
      <div className="md:col-span-2">{bill?.id}</div>
      <div className="md:col-span-2">{formatCurrency(totalHT)}</div>
      <div className="md:col-span-2">{vat}%</div>
      <div className="md:col-span-2 flex justify-between">{totalTTC}</div>
    </div>
  )
}

export default Row

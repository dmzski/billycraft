import { Button, Icon, Input, Select } from '@coco-ui/core'
import { BillApi } from 'api/BillApi'
import { SupplierApi } from 'api/SupplierApi'
import { useFormatCurrency } from 'hooks/useFormatCurrency'
import { OutgoingLineResponse, OutgoingRequest } from 'models/Outgoing'
import { useMemo } from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'
import { useQuery } from 'react-query'

const DEFAULT_LINE_COLOR = 'initial'

type RowProps = {
  line: OutgoingLineResponse
}
const Row = ({
  line: { totalHT, vat, billId, supplierBillReference, supplierId },
}: RowProps): JSX.Element => {
  const formatCurrency = useFormatCurrency()
  const { data: bills, isLoading: isLoadingBills } = useQuery(['bills'], BillApi.findAll, {
    refetchOnWindowFocus: false,
    staleTime: 6000,
  })
  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery(
    ['suppliers'],
    SupplierApi.findAll,
    {
      refetchOnWindowFocus: false,
      staleTime: 6000,
    },
  )

  const totalTTC = useMemo(
    () =>
      !Number.isNaN(totalHT) && !Number.isNaN(vat)
        ? formatCurrency(Number(totalHT * (1 - vat)) || 0)
        : '',
    [totalHT, vat, formatCurrency],
  )

  const bill = useMemo(() => {
    if (bills) return bills.find(({ id }) => id === billId)

    return undefined
  }, [bills])

  const supplier = useMemo(() => {
    if (suppliers) return suppliers?.find(({ id }) => id === supplierId)

    return undefined
  }, [suppliers])

  const lineColor = useMemo(() => {
    if (supplierId && suppliers) {
      return suppliers.find(({ id }) => id === supplierId)?.color ?? DEFAULT_LINE_COLOR
    }

    return DEFAULT_LINE_COLOR
  }, [supplierId, suppliers])

  return (
    <div
      style={{ backgroundColor: lineColor }}
      className="p-2 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 border-b"
    >
      <div className="col-span-2">{supplier?.name ?? 'Divers'}</div>
      <div className="col-span-2">{supplierBillReference}</div>
      <div className="col-span-2">{bill?.id}</div>
      <div className="col-span-2">{formatCurrency(totalHT)}</div>
      <div className="col-span-2">{vat}&nbsp;%</div>
      <div className="col-span-2 flex justify-between">{totalTTC}</div>
    </div>
  )
}

export default Row

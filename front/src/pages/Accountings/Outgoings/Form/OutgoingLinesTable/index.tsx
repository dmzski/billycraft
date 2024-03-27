import { Button, Loader } from '@coco-ui/core'
import { OutgoingRequest } from '@/models/Outgoing'
import { Control, useFieldArray } from 'react-hook-form'
import Row from './Row'
import { useI18n } from '@/i18n'

type OutgoingTableProps = {
  isLoading?: boolean
  control: Control<OutgoingRequest>
}
const OutgoingLinesTable = ({ isLoading, control }: OutgoingTableProps) => {
  const { t } = useI18n()
  const { fields, append, remove } = useFieldArray({
    name: 'lines',
    control,
    keyName: 'line',
  })

  const addLine = () => {
    append({
      vat: 0,
      totalHT: 0,
      line: fields.length + 1,
    })
  }

  return (
    <div className="border rounded">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-base-300 border-b p-4">
        <div className="col-span-2">{t('supplier')} *</div>
        <div className="col-span-2">
          {t('accounting.outgoings.details.lines.headers.billReference')} *
        </div>
        <div className="col-span-2">
          {t('accounting.outgoings.details.lines.headers.linkedBill')}
        </div>
        <div className="col-span-2">{t('etTotal')} *</div>
        <div className="col-span-2">{t('vat')} (%)</div>
        <div className="col-span-2">{t('itTotal')}</div>
      </div>
      {isLoading ? (
        <div className="px-4 flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading ? (
        <div className="pb-4 flex flex-col">
          {fields.map((line, index) => (
            <Row key={line.line} index={index} control={control} onDelete={() => remove(index)} />
          ))}
          <div className="mt-4 px-4">
            <Button type="button" className="w-full" variant="ghost" onClick={addLine}>
              {t('accounting.outgoings.forms.add.lines.add')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default OutgoingLinesTable

import { Button, Loader } from '@coco-ui/core'
import { OutgoingRequest } from 'models/Outgoing'
import { useCallback } from 'react'
import { Control, useFieldArray } from 'react-hook-form'
import Row from './Row'

type OutgoingTableProps = {
  isLoading?: boolean
  control: Control<OutgoingRequest>
}
const OutgoingLinesTable = ({ isLoading, control }: OutgoingTableProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({
    name: 'lines',
    control,
    keyName: 'line',
  })

  const addLine = useCallback(() => {
    append({
      line: fields.length + 1,
      totalHT: 0,
      vat: 0,
    })
  }, [fields, append])

  return (
    <div className="border rounded">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-primary-700 items-center bg-primary-50 border-b p-4 px-4">
        <div className="col-span-2">Fournisseur *</div>
        <div className="col-span-2">Référence facture *</div>
        <div className="col-span-2">Facture liée</div>
        <div className="col-span-2">Total HT *</div>
        <div className="col-span-2">TVA</div>
        <div className="col-span-2">Total TTC</div>
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
            <Button className="w-full" variant="secondary" onClick={addLine}>
              Ajouter une ligne
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default OutgoingLinesTable

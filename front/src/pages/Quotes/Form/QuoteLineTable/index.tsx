import { Button, Select } from '@coco-ui/core'
import { ProductApi } from '@/api/ProductApi'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { useCallback, useMemo, useState } from 'react'
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd'
import { Control, useFieldArray } from 'react-hook-form'
import { nanoid } from 'nanoid'
import QuoteLineTableLine from './Row'
import { QuoteFormValues } from '../Form'
import { useDataLoader } from '@scaleway/use-dataloader'
import { PlusIcon } from '@heroicons/react/24/solid'

const defaultLine = {
  description: '',
  name: '',
  price: 0,
  quantity: 0,
  type: LineTypeEnum.ARTICLE,
}

const QuoteLineTable = ({
  disabled,
  control,
}: {
  disabled?: boolean
  control: Control<QuoteFormValues>
}) => {
  const productsQuery = useDataLoader('products', () => ProductApi.findAll())
  const [productIdSelected, setProductIdSelected] = useState<number>()
  const onProductSelectedChange = useCallback((option: string) => {
    setProductIdSelected(Number(option))
  }, [])

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'lines',
    keyName: 'id',
  })

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return
      }

      move(result.source.index, result.destination.index)
    },
    [move],
  )

  const addLine = useCallback(
    (newLine = defaultLine) => {
      append({ ...newLine, quoteId: "", line: fields.length, id: nanoid() })
      document.getElementById('root')?.scrollTo({
        behavior: 'smooth',
        top: document.getElementById('root')?.scrollHeight,
      })
    },
    [append, fields],
  )

  const productOptions = useMemo(() => {
    if (productsQuery.data) {
      return productsQuery.data.map(product => ({
        value: product.id,
        label: product.name,
      }))
    }
    return []
  }, [productsQuery.data])

  const addExistingProductSelected = () => {
    if (productIdSelected && productsQuery.data) {
      addLine({...defaultLine, ...(productsQuery.data.find(product => product.id === productIdSelected) ?? {})})
      setProductIdSelected(undefined)
      document.getElementById('root')?.scrollTo({
        behavior: 'smooth',
        top: document.getElementById('root')?.scrollHeight,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key === 'Enter' && !disabled) {
      e.stopPropagation()
      addLine()
    }
  }

  return (
    <div className="flex flex-col gap-4 border p-4 rounded">
      <div>
        <div className="rounded bg-base-300 grid md:grid-cols-12 gap-2 p-4 mb-1">
          <div className="pl-4 md:col-span-2">Type</div>
          <div className="md:col-span-3">Nom&nbsp;*</div>
          <div className="md:col-span-3">Description</div>
          <div className="md:col-span-1">Quantité</div>
          <div className="md:col-span-1">Prix HT</div>
          <div className="md:col-span-1">Prix TTC</div>
          <div className="md:col-span-1">Sous total</div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="lines">
            {droppableProvided => (
              <div
                className="flex flex-col"
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                onKeyDown={handleKeyDown}
                role="row"
                tabIndex={0}
              >
                {fields?.map((line, index) => (
                  <Draggable
                    key={`draggable-${line.id}`}
                    draggableId={line.id}
                    index={index}
                    isDragDisabled={disabled}
                  >
                    {provided => (
                      <QuoteLineTableLine
                        provided={provided}
                        key={`${line.id}`}
                        disabled={disabled}
                        index={index}
                        control={control}
                        deleteLine={() => remove(index)}
                      />
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {!disabled ? (
          <div className="flex flex-col gap-2">
            <Button type="button" variant="ghost" block onClick={() => addLine()} disabled={disabled}>
              <PlusIcon className='w-5' />
              &nbsp; Ajouter une ligne
            </Button>
            <div className="grid md:grid-cols-4 items-end gap-4">
              <Select
                tabIndex={0}
                className="md:col-span-3"
                name="existing-product"
                id="existing-product"
                options={productOptions}
                isSearchable
                placeholder="Sélectionner un produit existant"
                value={productIdSelected}
                onChange={onProductSelectedChange}
              />
              <Button block onClick={addExistingProductSelected} type="button" variant="primary">
                Ajouter
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default QuoteLineTable

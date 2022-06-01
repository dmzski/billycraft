import { Button, List, Select } from '@coco-ui/core'
import { ValueType } from '@coco-ui/core/dist/components/Select'
import { ProductApi } from 'api/ProductApi'
import { LineTypeEnum } from 'models/LineTypeEnum'
import { useCallback } from 'react'
import * as React from 'react'
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd'
import { Control, useFieldArray } from 'react-hook-form'
import { useQuery } from 'react-query'
import { nanoid } from 'nanoid'
import BillLineTableLine from './Row'

const defaultLine = {
  description: '',
  name: '',
  price: 0,
  quantity: 0,
  type: LineTypeEnum.ARTICLE,
}

type BillLineTableProps = {
  disabled?: boolean
  control: Control
}

const BillLineTable = ({ control, disabled }: BillLineTableProps): JSX.Element => {
  const productsQuery = useQuery('products', ProductApi.findAll, {
    refetchOnWindowFocus: false,
  })
  const [productIdSelected, setProductIdSelected] = React.useState<number>()
  const onProductSelectedChange = React.useCallback((option: ValueType) => {
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

  const addLine = React.useCallback(
    (newLine = defaultLine) => {
      append({ ...newLine, line: nanoid() })
      document.getElementById('root')?.scrollTo({
        behavior: 'smooth',
        top: document.getElementById('root')?.scrollHeight,
      })
    },
    [append, fields],
  )

  const productOptions = React.useMemo(() => {
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
      addLine(productsQuery.data.find(product => product.id === productIdSelected))
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
    <div className="border p-2 rounded">
      {!disabled ? (
        <div className="my-4 flex items-end">
          <Select
            label="Ajouter un produit existant"
            tabIndex={0}
            className="flex-grow"
            name="existing-product"
            id="existing-product"
            options={productOptions}
            isLoading={productsQuery.isLoading}
            isSearchable
            placeholder="Nom du produit"
            value={productIdSelected}
            onChange={onProductSelectedChange}
          />
          <Button
            onClick={addExistingProductSelected}
            type="button"
            className="py-2 ml-4 w-1/6"
            variant="primary"
          >
            Ajouter
          </Button>
        </div>
      ) : null}
      <div className="rounded bg-primary-50 text-primary-700 grid md:grid-cols-12 gap-2 p-4 mb-1">
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
              // eslint-disable-next-line react/jsx-props-no-spreading
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
                    <BillLineTableLine
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
        <Button
          type="button"
          variant="inverted-primary"
          className="w-full mt-4"
          size="sm"
          onClick={addLine}
          disabled={disabled}
          icon="plus"
        >
          Ajouter une ligne
        </Button>
      ) : null}
    </div>
  )
}

export default BillLineTable

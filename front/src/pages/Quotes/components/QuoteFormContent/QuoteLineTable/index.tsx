import { Button, Select } from '@coco-ui/core'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { ComponentProps, useMemo, useRef, useState } from 'react'
import { Control, useFieldArray } from 'react-hook-form'
import QuoteLineTableLine from './Row'
import { PlusIcon } from '@heroicons/react/24/solid'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useI18n } from '@/i18n'
import { useAllProductsQuery } from '@/queries/useAllProductsQuery'
import { QuoteFormValues } from '../types'
import { LINE_TYPE } from '@/constants/line'

const defaultLine: QuoteFormValues['lines'][number] = {
  description: undefined,
  name: '',
  price: 0,
  quantity: 0,
  type: LineTypeEnum.TEXT,
  line: 0,
  quoteId: "",
  id: "",
}

const QuoteLineTable = ({
  disabled,
  control,
}: {
  disabled?: boolean
  control: Control<QuoteFormValues>
}) => {
  const { t } = useI18n()
  const selectExistingProductRef = useRef<HTMLInputElement>(null)
  const { data: allProducts } = useAllProductsQuery()
  const [productIdSelected, setProductIdSelected] = useState<number>()

  const onProductSelectedChange = (option: string) => {
    setProductIdSelected(Number(option))
  }

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'lines',
  })

  const onDragEnd: ComponentProps<typeof DndContext>['onDragEnd'] = event => {
    if (
      event.over?.id &&
      event.active.id &&
      event.active.data.current?.lineIndex !== undefined &&
      event.over.data.current?.lineIndex !== undefined
    ) {
      move(event.active.data.current.lineIndex, event.over.data.current.lineIndex)
    }

    return
  }

  const addLine = (newLine = defaultLine) => {
    append({ ...newLine, quoteId: '', line: fields.length, id: '' })
  }
  const productOptions: ComponentProps<typeof Select>['options'] = useMemo(() => {
    if (allProducts) {
      return allProducts.map(product => {
        const IconComponent = LINE_TYPE[product.type]?.icon
        return {
          value: product.id,
          searchText: product.name,
          label: (
            <span className='inline-flex gap-2 items-center'>
              {IconComponent ? <IconComponent className='w-5' /> : null}
              {product.name}
            </span>
          ),
        }
      }
      )
    }

    return []
  }, [allProducts])

  const addExistingProductSelected = () => {
    if (productIdSelected && allProducts) {
      const productFound = allProducts.find(product => product.id === productIdSelected)
      if (productFound) {
        const newLine: QuoteFormValues['lines'][number] = {
          name: productFound.name,
          type: productFound.type,
          price: productFound.price,
          quantity: 0,
          quoteId: "",
          line: 0,
          description: productFound.description,
          productId: productFound.id
        }
        addLine(newLine)
        setProductIdSelected(undefined)
        setTimeout(() => {
          selectExistingProductRef.current?.focus()
        }, 200)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 border p-4 rounded">
      {!disabled ? (
        <div className="grid md:grid-cols-4 items-end gap-4">
          <Select
            ref={selectExistingProductRef}
            className="md:col-span-3"
            name="existing-product"
            id="existing-product"
            options={productOptions}
            isSearchable
            placeholder={t('quotes.form.lines.existingProduct.label')}
            value={productIdSelected}
            onChange={onProductSelectedChange}
          />
          <Button block onClick={addExistingProductSelected} type="button" variant="primary">
            {t('quotes.form.lines.existingProduct.add')}
          </Button>
        </div>
      ) : null}
      <div className='flex flex-col divide-y'>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext items={fields}>
            {fields?.map((line, index) => (
              <QuoteLineTableLine
                key={line.id}
                disabled={disabled}
                id={line.id}
                index={index}
                control={control}
                deleteLine={() => remove(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
        {!disabled ? (
          <Button className="gap-1 mt-2" type="button" block onClick={() => addLine()}>
            <PlusIcon className="w-5" />
            {t('quotes.form.lines.add')}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default QuoteLineTable

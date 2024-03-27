import { Button, Select } from '@coco-ui/core'
import { ProductApi } from '@/api/ProductApi'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { ComponentProps, useCallback, useMemo, useState } from 'react'
import { Control, useFieldArray } from 'react-hook-form'
import BillLineTableLine from './Row'
import { BillFormValues } from '../Form'
import { useDataLoader } from '@scaleway/use-dataloader'
import { PlusIcon } from '@heroicons/react/24/solid'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useI18n } from '@/i18n'

const defaultLine = {
  description: '',
  name: '',
  price: 0,
  quantity: 0,
  type: LineTypeEnum.ARTICLE,
}

type BillLineTableProps = {
  disabled?: boolean
  control: Control<BillFormValues>
}

const BillLineTable = ({ control, disabled }: BillLineTableProps) => {
  const { t } = useI18n()
  const productsQuery = useDataLoader('products', ProductApi.findAll)
  const [productIdSelected, setProductIdSelected] = useState<number>()
  const onProductSelectedChange = useCallback((option: string) => {
    setProductIdSelected(Number(option))
  }, [])

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'lines',
    keyName: 'id',
  })

  const onDragEnd: ComponentProps<typeof DndContext>['onDragEnd'] = useCallback(
    event => {
      if (
        !event.over.id ||
        !event.active.id ||
        !event.active.data.current.lineIndex === undefined ||
        !event.over.data.current.lineIndex === undefined
      ) {
        return
      }

      move(event.active.data.current.lineIndex, event.over.data.current.lineIndex)
    },
    [move],
  )

  const addLine = useCallback(
    (newLine = defaultLine) => {
      append({ ...defaultLine, ...newLine, line: fields.length, billId: '', id: '' })
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
      addLine({
        ...defaultLine,
        ...(productsQuery.data.find(product => product.id === productIdSelected) ?? {}),
      })
      setProductIdSelected(undefined)
      document.getElementById('root')?.scrollTo({
        behavior: 'smooth',
        top: document.getElementById('root')?.scrollHeight,
      })
    }
  }

  return (
    <div className="flex flex-col border p-2 gap-2">
      <div className="grid md:grid-cols-4 items-end gap-4">
        <Select
          autoComplete="off"
          className="md:col-span-3"
          name="existing-product"
          id="existing-product"
          options={productOptions}
          isSearchable
          placeholder={t('bills.form.lines.existingProduct.label')}
          value={productIdSelected}
          onChange={onProductSelectedChange}
        />
        <Button block onClick={addExistingProductSelected} type="button" variant="primary">
          {t('bills.form.lines.existingProduct.add')}
        </Button>
      </div>
      <div className="rounded-t bg-base-200 grid md:grid-cols-12 gap-2 p-4 mb-1">
        <div className="pl-4 md:col-span-2">{t('bills.form.lines.headers.type')}</div>
        <div className="md:col-span-3">{t('bills.form.lines.headers.name')}</div>
        <div className="md:col-span-3">{t('bills.form.lines.headers.description')}</div>
        <div className="md:col-span-1">{t('bills.form.lines.headers.quantity')}</div>
        <div className="md:col-span-1">{t('bills.form.lines.headers.etPrice')}</div>
        <div className="md:col-span-1">{t('bills.form.lines.headers.itPrice')}</div>
        <div className="md:col-span-1">{t('bills.form.lines.headers.subTotal')}</div>
      </div>
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={fields}>
          {fields?.map((line, index) => (
            <BillLineTableLine
              key={line.id}
              id={line.id}
              disabled={disabled}
              index={index}
              control={control}
              deleteLine={() => remove(index)}
            />
          ))}
        </SortableContext>
      </DndContext>
      {!disabled ? (
        <div className="flex flex-col gap-2">
          <Button
            className="gap-2"
            type="button"
            block
            onClick={() => addLine()}
            disabled={disabled}
          >
            <PlusIcon className="w-5" />
            <span>{t('bills.form.lines.add')}</span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default BillLineTable

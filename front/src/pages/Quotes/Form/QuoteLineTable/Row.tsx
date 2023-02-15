import { Button, Icon, Input, Select, TextArea } from '@coco-ui/core'
import { useFormatCurrency } from 'hooks/useFormatCurrency'
import { LineTypeEnum } from 'models/LineTypeEnum'
import { useMemo, useRef } from 'react'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { Control, Controller, useWatch } from 'react-hook-form'
import { LINE_TYPE } from '../../../../constants/line'
import { QuoteFormValues } from '../Form'

type QuoteLineTableLineProps = {
  deleteLine: () => void
  disabled?: boolean
  provided?: DraggableProvided
  snapshot?: DraggableStateSnapshot
  index: number
  control: Control<QuoteFormValues>
}
const QuoteLineTableLine = ({
  deleteLine,
  disabled,
  provided,
  index,
  control,
}: QuoteLineTableLineProps): JSX.Element => {
  const tva = useWatch({ control, name: 'tva' })
  const formatPrice = useFormatCurrency()
  const typeRef = useRef<HTMLInputElement | null>()
  const nameRef = useRef<HTMLInputElement | null>()
  const descriptionRef = useRef<HTMLTextAreaElement | null>()
  const quantityRef = useRef<HTMLInputElement | null>()
  const priceRef = useRef<HTMLInputElement | null>()

  const price = useWatch({
    control,
    name: `lines.${index}.price`,
    defaultValue: 0,
  })
  const quantity = useWatch({
    control,
    name: `lines.${index}.quantity`,
    defaultValue: 0,
  })

  const priceTTC = useMemo(() => {
    if (Number.isNaN(price) || !price) {
      return 0
    }
    const computedTva = Number(tva) || 0

    return price * (1 + computedTva / 100)
  }, [price, tva])

  const totalTTC = useMemo(() => {
    if (Number.isNaN(quantity) || !quantity) {
      return 0
    }

    return quantity * priceTTC
  }, [priceTTC, quantity])

  return (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...provided?.draggableProps}
      className="bg-base-100 grid md:grid-cols-12 mb-2 p-2 gap-2"
      ref={provided?.innerRef}
    >
      <div className="flex md:col-span-2">
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided?.dragHandleProps}
          className="items-center flex mr-2"
        >
          <Icon name="selector" size={12} />
        </div>
        <div className="flex-grow">
          <Controller
            name={`lines.${index}.type`}
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { invalid } }) => (
              <Select
                disabled={disabled}
                error={invalid}
                value={field.value}
                onChange={type => field.onChange(type as LineTypeEnum)}
                ref={node => {
                  field.ref(node)
                  typeRef.current = node
                }}
                options={Object.values(LINE_TYPE).map(type => ({
                  value: type.enum,
                  label: type.name,
                }))}
                name={field.name}
                id={`${field.name}-select`}
              />
            )}
          />
        </div>
      </div>
      <Controller
        name={`lines.${index}.name`}
        rules={{ required: true }}
        defaultValue=""
        control={control}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            required
            placeholder="Nom"
            className="md:col-span-3"
            disabled={disabled}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            error={invalid}
            ref={node => {
              field.ref(node)
              nameRef.current = node
            }}
          />
        )}
      />
      <Controller
        name={`lines.${index}.description`}
        control={control}
        render={({ field }) => (
          <TextArea
            placeholder="Description"
            className="md:col-span-3"
            rows={1}
            disabled={disabled}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={node => {
              field.ref(node)
              descriptionRef.current = node
            }}
          />
        )}
      />
      <Controller
        defaultValue={0}
        name={`lines.${index}.quantity`}
        control={control}
        render={({ field }) => (
          <Input
            disabled={disabled}
            className="md:col-span-1"
            placeholder="Quantité"
            type="number"
            step={0.01}
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={event => {
              field.onChange(Number((event.target as HTMLInputElement).value) || 0)
              field.onBlur()
            }}
            ref={node => {
              field.ref(node)
              quantityRef.current = node
            }}
          />
        )}
      />
      <Controller
        defaultValue={0}
        name={`lines.${index}.price`}
        control={control}
        render={({ field }) => (
          <Input
            className="md:col-span-1"
            disabled={disabled}
            placeholder="Prix"
            type="number"
            step={0.01}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={event => {
              field.onChange(Number((event.target as HTMLInputElement).value) || 0)
              field.onBlur()
            }}
            ref={node => {
              field.ref(node)
              priceRef.current = node
            }}
          />
        )}
      />
      <div className="flex items-center">{formatPrice(priceTTC)}</div>
      <div className="pr-2 flex items-center justify-between">
        <div className="flex-grow">{formatPrice(totalTTC)}</div>
        {!disabled ? (
          <Button variant="error" onClick={deleteLine}>
            <Icon name="trash" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default QuoteLineTableLine

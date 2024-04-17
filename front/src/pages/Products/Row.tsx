import { Button, Input, Select, TextArea, useToast } from '@coco-ui/core'
import { LINE_TYPE } from '@/constants/line'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { useController, useForm } from 'react-hook-form'
import clsx from 'clsx'
import Product from '@/models/Product'
import { ProductApi } from '@/api/ProductApi'
import { MouseEvent, useMemo, useState } from 'react'
import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useAllProductsQuery } from '@/queries/useAllProductsQuery'

type ProductTableLineProps = {
  product?: Product
}

type ProductFormValues = {
  type: LineTypeEnum
  name: string
  description: string
  price: number
}

const MODES = {
  EDIT: 'EDIT',
  READ: 'READ',
  DELETE: 'DELETE',
}

const defaultProduct = {
  type: LineTypeEnum.ARTICLE,
  name: '',
  description: '',
  price: 0,
}

const ProductTableLine = ({ product }: ProductTableLineProps) => {
  const isNew = !product
  const { t } = useI18n()
  const { reload } = useAllProductsQuery({ enabled: false })
  const [mode, setMode] = useState(isNew ? MODES.EDIT : MODES.READ)

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, disabled },
    reset,
  } = useForm<ProductFormValues>({
    values: product ?? defaultProduct,
    mode: 'onChange',
    shouldUnregister: true,
    disabled: mode !== MODES.EDIT && !isNew
  })
  const toast = useToast()

  const toggleEditMode = (e: MouseEvent) => {
    e.stopPropagation()
    setMode(current => (current === MODES.EDIT ? MODES.READ : MODES.EDIT))
  }

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await ProductApi.createOrUpdate({
        id: product?.id,
        description: data.description,
        price: `${data.price}` !== '' ? parseFloat(`${data.price}`) : 0,
        type: data.type,
        name: data.name,
      })
      toast.success(t('products.list.row.form.submit.success'))
      if (isNew) {
        reset({ ...defaultProduct })
      } else setMode(MODES.READ)

      await reload()
    } catch {
      toast.error(t('products.list.row.form.submit.error'))
    }
  }

  const toggleDeleteMode = () => {
    setMode(current => (current === MODES.DELETE ? MODES.READ : MODES.DELETE))
  }

  const onDelete = async () => {
    try {
      if (product?.id) {
        await ProductApi.delete(product.id)
        await reload()
        toast.success(t('products.list.row.delete.submit.success'))
      }
    } catch {
      toast.error(t('products.list.row.delete.submit.error'))
    }
  }

  const typeOptions = useMemo(() => Object.values(LINE_TYPE).map(type => ({
    value: type.enum,
    label: type.name,
  })), [])

  const { field: typeField, fieldState: typeFieldState } = useController({ control, name: "type", rules: { required: true } })
  const { field: nameField, fieldState: nameFieldState } = useController({ control, name: "name", rules: { required: true, minLength: 1 } })
  const { field: descriptionField, fieldState: descriptionFieldState } = useController({ control, name: "description" })
  const { field: priceField, fieldState: priceFieldState } = useController({ control, name: "price" })

  return (
    <form
      onSubmit={!disabled ? handleSubmit(onSubmit) : undefined}
      className={clsx(
        'grid md:grid-cols-12 px-4 py-2 gap-2 border-b items-center',
        mode === MODES.DELETE ? 'bg-error bg-opacity-50' : null,
      )}
    >
      <div className="md:col-span-2">
        <Select
          error={typeFieldState.invalid}
          value={typeField.value}
          name={typeField.name}
          className="w-full"
          onChange={typeField.onChange}
          options={typeOptions}
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-3">
        <Input
          name={nameField.name}
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          disabled={disabled}
          ref={nameField.ref}
          error={nameFieldState.invalid}
        />
      </div>
      <div className="md:col-span-4 flex">
        <TextArea
          rows={1}
          name={descriptionField.name}
          value={descriptionField.value ?? ''}
          onChange={descriptionField.onChange}
          onBlur={descriptionField.onBlur}
          disabled={disabled}
          error={descriptionFieldState.invalid}
          className="w-full"
        />
      </div>
      <div className="md:col-span-2 flex relative">
        <Input
          className='min-w-0'
          name={priceField.name}
          value={priceField.value}
          onChange={priceField.onChange}
          onBlur={event => {
            priceField.onChange(Number((event.target as HTMLInputElement).value) || 0)
            priceField.onBlur()
          }}
          disabled={disabled}
          type="number"
          step={0.1}
          error={priceFieldState.invalid}
        />
      </div>
      <div className="flex justify-end">
        {(mode === MODES.DELETE && !isNew) && disabled ? (
          <div className="flex relative gap-2">
            <Button type="button" variant="success" square onClick={onDelete}>
              <CheckIcon className="w-5" />
            </Button>
            <Button type="button" variant="error" square onClick={toggleDeleteMode}>
              <XMarkIcon className="w-5" />
            </Button>
          </div>
        ) : null}
        {!disabled ? (
          <div className="flex gap-2 justify-end">
            <Button type="submit" square variant="success" disabled={!isValid || isSubmitting}>
              <CheckIcon className="w-5" />
            </Button>
            {product?.id ? (
              <Button type="button" square variant="error" onClick={toggleEditMode}>
                <XMarkIcon className="w-5" />
              </Button>
            ) : null}
          </div>
        ) : null}
        {(mode === MODES.READ && !isNew) && disabled ? (
          <div className="flex gap-2 justify-end">
            <Button outline type="button" onClick={toggleEditMode} variant="primary" square>
              <PencilIcon className="w-5" />
            </Button>
            <Button type="button" onClick={toggleDeleteMode} square variant="error" outline>
              <TrashIcon className="w-5" />
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  )
}

export default ProductTableLine

import { Button, Input, Select, TextArea, useToast } from '@coco-ui/core'
import { LINE_TYPE } from '@/constants/line'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { Controller, useForm } from 'react-hook-form'
import { STRINGS } from '@/constants/strings'
import clsx from 'clsx'
import Product from '../../models/Product'
import { ProductApi } from '../../api/ProductApi'
import { useDataLoaderContext } from '@scaleway/use-dataloader'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid'

type ProductTableLineProps = {
  product?: Product
}

type ProductFormValues = {
  type: LineTypeEnum,
  name: string,
  description: string,
  price: number
}

const MODES = {
  EDIT: 'EDIT',
  READ: 'READ',
  DELETE: 'DELETE',
}

const ProductTableLine = ({ product }: ProductTableLineProps) => {
  const isNew = !product
  const [mode, setMode] = useState(isNew ? MODES.EDIT : MODES.READ)
  const initialValues = useMemo(
    () => ({
      type: LineTypeEnum.ARTICLE,
      name: '',
      description: '',
      price: 0,
    }),
    [],
  )
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    values: initialValues,
    mode: 'all',
    shouldUnregister: true,
  })
  const { reload } = useDataLoaderContext()
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
      toast.success(STRINGS.SAVE_SUCCESS)
      if (isNew) {
        reset({
          type: LineTypeEnum.ARTICLE,
          name: '',
          description: '',
          price: 0,
        })
      } else setMode(MODES.READ)

      reload('products')
    } catch {
      toast.error(STRINGS.SAVE_ERROR)
    }
  }

  const toggleDeleteMode = () => {
    setMode(current => (current === MODES.DELETE ? MODES.READ : MODES.DELETE))
  }

  const onDelete = async () => {
    try {
      await ProductApi.delete(product?.id ?? 0)
      reload('products')
      toast.success(STRINGS.DELETE_SUCCESS)
    } catch {
      toast.error(STRINGS.DELETE_ERROR)
    }
  }

  const formID = `form-product-${product?.id ?? 'new'}`

  useEffect(() => {
    if (product?.id) {
      reset(product)
    }
  }, [product, reset])

  return (
    <div className={clsx('grid md:grid-cols-12 px-4 py-2 gap-2 border-b items-center', mode === MODES.DELETE ? "bg-error bg-opacity-50" : null)}>
      <div className="md:col-span-2">
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Select
              error={invalid}
              value={field.value}
              name={field.name}
              /* Otherwise it will be to large */
              className='w-full'
              onChange={type => {
                field.onChange(type)
              }}
              options={Object.values(LINE_TYPE).map(type => ({
                value: type.enum,
                label: type.name,
              }))}
              disabled={mode !== MODES.EDIT}
            />
          )}
        />
      </div>
      <div className="md:col-span-3">
        <Controller
          name="name"
          control={control}
          rules={{
            required: true,
            minLength: 1,
          }}
          render={({ field, fieldState }) => (
            <Input
              name={`${formID}-${field.name}`}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={mode !== MODES.EDIT}
              ref={field.ref}
              error={fieldState.invalid}
            />
          )}
        />
      </div>
      <div className="md:col-span-4 flex">
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <TextArea
              rows={1}
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={mode !== MODES.EDIT}
              error={fieldState.invalid}
              className='w-full'
            />
          )}
        />
      </div>
      <div className="md:col-span-2 flex relative">
        <Controller
          name="price"
          rules={{ min: 0 }}
          defaultValue={0}
          control={control}
          render={({ field }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={event => {
                field.onChange(Number((event.target as HTMLInputElement).value) || 0)
                field.onBlur()
              }}
              disabled={mode !== MODES.EDIT}
              type="number"
              step={0.1}
              error={!!errors.price}
            />
          )}
        />
        <span className={clsx("right-0 inset-y-2 absolute flex items-center", mode !== MODES.EDIT ? 'bg-base-200' : "bg-base-100")}>€</span>
      </div>
      <div className="md:col-span-1 flex justify-end">
        {mode === MODES.DELETE && !isNew ? (
          <div className="flex relative gap-2">
            <Button type="button" variant="success" square onClick={onDelete}>
              <CheckIcon className='w-5' />
            </Button>
            <Button type="button" variant="error" square onClick={toggleDeleteMode}>
              <XMarkIcon className='w-5' />
            </Button>
          </div>
        ) : null}
        {mode === MODES.EDIT || isNew ? (
          <div className="flex gap-2">
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <Button type="submit" square variant="success" disabled={!isValid || isSubmitting}>
                <CheckIcon className='w-5' />
              </Button>
            </form>
            {product?.id ? (
              <Button type="button" square variant="error" onClick={toggleEditMode}>
                <XMarkIcon className='w-5' />
              </Button>
            ) : null}
          </div>
        ) : null}
        {mode === MODES.READ && !isNew ? (
          <div className="flex gap-2">
            <Button outline type="button" onClick={toggleEditMode} variant="primary" square>
              <PencilIcon className='w-5' />
            </Button>
            <Button
              type="button"
              onClick={toggleDeleteMode}
              square
              variant="error"
              outline
            >
              <TrashIcon className='w-5' />
            </Button>
          </div>
        ) : null}
      </div>
    </div >
  )
}

export default ProductTableLine

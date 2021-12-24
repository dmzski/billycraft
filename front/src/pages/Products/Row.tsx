import { Button, Icon, Input, Select, Table, TextArea, useToast } from '@coco-ui/core'
import * as React from 'react'
import { useMutation, useQueryCache } from 'react-query'
import { LINE_TYPE } from 'constants/line'
import { LineTypeEnum } from 'models/LineTypeEnum'
import { Controller, useForm } from 'react-hook-form'
import { STRINGS } from 'constants/strings'
import Product from '../../models/Product'
import { ProductApi } from '../../api/ProductApi'

type ProductTableLineProps = {
  product: Product
  isNew?: boolean
}

const MODES = {
  EDIT: 'EDIT',
  READ: 'READ',
  DELETE: 'DELETE',
}

const ProductTableLine = ({ product, isNew }: ProductTableLineProps): JSX.Element => {
  const [mode, setMode] = React.useState(isNew ? MODES.EDIT : MODES.READ)
  const defaultValues = React.useMemo(
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
  } = useForm({
    defaultValues,
    mode: 'all',
    shouldUnregister: true,
  })
  const [deleteProductMutation, deleteProductMutationState] = useMutation(ProductApi.delete)
  const queryCache = useQueryCache()
  const toast = useToast()

  const toggleEditMode = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMode(current => (current === MODES.EDIT ? MODES.READ : MODES.EDIT))
  }

  const onSubmit = async (data: Product) => {
    try {
      await ProductApi.createOrUpdate({
        id: product.id,
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

      queryCache.refetchQueries('products')
    } catch {
      toast.error(STRINGS.SAVE_ERROR)
    }
  }

  const toggleDeleteMode = () => {
    setMode(current => (current === MODES.DELETE ? MODES.READ : MODES.DELETE))
  }

  const onDelete = async () => {
    try {
      await deleteProductMutation(product.id)
      queryCache.invalidateQueries('products')
      toast.success(STRINGS.DELETE_SUCCESS)
    } catch {
      toast.error(STRINGS.DELETE_ERROR)
    }
  }

  const formID = `form-product-${product.id ?? 'new'}`

  React.useEffect(() => {
    if (product.id) {
      reset(product)
    }
  }, [product, reset])

  return (
    <Table.Row>
      <Table.Cell>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Select
              error={invalid}
              value={field.value}
              name={field.name}
              className="w-full"
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
      </Table.Cell>
      <Table.Cell>
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
              className="w-full"
              error={fieldState.invalid}
            />
          )}
        />
      </Table.Cell>
      <Table.Cell>
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
              className="w-full"
              error={fieldState.invalid}
            />
          )}
        />
      </Table.Cell>
      <Table.Cell className="w-48">
        <div className="w-full flex">
          <Controller
            name="price"
            rules={{ min: 0 }}
            control={control}
            render={({ field }) => (
              <Input
                name={field.name}
                value={field.value ?? ''}
                onBlur={event => {
                  field.onChange(Number((event.target as HTMLInputElement).value) || 0)
                  field.onBlur()
                }}
                disabled={mode !== MODES.EDIT}
                className="w-full text-right"
                type="number"
                step={0.1}
                error={!!errors.price}
              />
            )}
          />
          <span className="ml-2 pt-2">€</span>
        </div>
      </Table.Cell>
      <Table.Cell className="w-20">
        {mode === MODES.DELETE && !isNew ? (
          <div className="flex relative">
            <span className="w-28 absolute pt-2 -top-full font-bold">Supprimer ?</span>
            <Button type="button" variant="success" size="md" className="w-8" onClick={onDelete}>
              <Icon name="check" />
            </Button>
            <Button
              type="button"
              className="w-8 ml-1"
              variant="error"
              size="md"
              onClick={toggleDeleteMode}
            >
              <Icon name="x" />
            </Button>
          </div>
        ) : null}
        {mode === MODES.EDIT || isNew ? (
          <div className="flex">
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <Button
                type="submit"
                size="md"
                variant="success"
                className="w-8"
                disabled={!isValid || isSubmitting}
              >
                <Icon name="check" />
              </Button>
            </form>
            {product.id ? (
              <Button
                type="button"
                size="md"
                variant="error"
                onClick={toggleEditMode}
                className="ml-1 w-8"
              >
                <Icon name="x" />
              </Button>
            ) : null}
          </div>
        ) : null}
        {mode === MODES.READ && !isNew ? (
          <div className="flex">
            <Button type="button" onClick={toggleEditMode} className="w-8" variant="info" size="md">
              <Icon name="pencil" />
            </Button>
            <Button
              type="button"
              disabled={deleteProductMutationState.isLoading}
              onClick={toggleDeleteMode}
              className="ml-1 w-8"
              size="md"
              variant="error"
            >
              <Icon name="trash" />
            </Button>
          </div>
        ) : null}
      </Table.Cell>
    </Table.Row>
  )
}

export default ProductTableLine

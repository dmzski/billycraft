import { useI18n } from '@/i18n'
import { Button, Modal, useToast } from '@coco-ui/core'
import { ComponentProps, useId } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ProductFormContent, ProductFormValues } from '../components/ProductFormContent'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { sendErrorToSentry } from '@/utils/errors'
import { ProductApi } from '@/api/ProductApi'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'
import Product from '@/models/Product'

type AddProductModalProps = {
  onSubmitSuccess: (newId: Product['id']) => Promise<void> | void
  disclosure: ComponentProps<typeof Modal>['disclosure']
  initialValues?: ProductFormValues
}

type AddProductFormProps = Omit<AddProductModalProps, 'disclosure'> & { close: () => void }

const defaultValues: ProductFormValues = {
  type: LineTypeEnum.ARTICLE,
  name: '',
  price: 0,
  description: '',
  supplierId: null,
  itPrice: 0,
  code: null,
  initialStock: null
}

const AddProductForm = ({ onSubmitSuccess, close, initialValues }: AddProductFormProps) => {
  const { scopedT, t } = useI18n()
  const toast = useToast()
  const pageT = scopedT('products.modals.add')
  const { data: suppliers } = useAllSuppliersQuery()
  const id = useId()

  const methods = useForm<ProductFormValues>({
    mode: 'onChange',
    values: initialValues ?? defaultValues,
  })

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const res = await ProductApi.create(values)
      toast.success(pageT('submit.success'))
      await onSubmitSuccess(res.id)
      close()
    } catch (err) {
      sendErrorToSentry(err, { data: values })
      toast.error(t('genericFormError'))
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        onSubmit={event => {
          event.preventDefault()
          event.stopPropagation()
          methods.handleSubmit(onSubmit)(event)
        }}
        className="flex flex-col gap-10"
      >
        <h2 className="text-2xl">{pageT('title')}</h2>
        <ProductFormContent suppliers={suppliers ?? []} />
        <Button
          variant="primary"
          type="submit"
          disabled={!methods.formState.isValid || methods.formState.isSubmitting}
          form={id}
        >
          {pageT('submit')}
        </Button>
      </form>
    </FormProvider>
  )
}

export const AddProductModal = ({
  onSubmitSuccess,
  disclosure,
  initialValues,
}: AddProductModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <AddProductForm
        initialValues={initialValues}
        onSubmitSuccess={onSubmitSuccess}
        close={close}
      />
    )}
  </Modal>
)

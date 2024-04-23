import { useI18n } from '@/i18n'
import { Button, Modal, useToast } from '@coco-ui/core'
import { ComponentProps, useId, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ProductFormContent, ProductFormValues } from '../components/ProductFormContent'
import { sendErrorToSentry } from '@/utils/errors'
import { ProductApi } from '@/api/ProductApi'
import Product from '@/models/Product'
import { calculatePriceTTC } from '@/utils/price'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'

type EditProductModalProps = {
  onSubmitSuccess: () => Promise<void>
  product: Product
  disclosure: ComponentProps<typeof Modal>['disclosure']
}

type EditProductFormProps = Omit<EditProductModalProps, 'disclosure'> & { close: () => void }

const EditProductForm = ({ product, onSubmitSuccess, close }: EditProductFormProps) => {
  const { scopedT, t } = useI18n()
  const toast = useToast()
  const pageT = scopedT('products.modals.edit')
  const { data: suppliers } = useAllSuppliersQuery()
  const id = useId()

  const initialValues: ProductFormValues = useMemo(
    () => ({
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type,
      supplierId: product.supplierId ?? null,
      itPrice: calculatePriceTTC(
        product.price,
        product.supplierId ? suppliers?.find(({ id }) => id === product.supplierId)?.vat ?? 0 : 0,
      ),
    }),
    [product, suppliers],
  )

  const methods = useForm<ProductFormValues>({
    mode: 'onChange',
    values: initialValues,
  })

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await ProductApi.update({ id: product.id, ...values })
      toast.success(pageT('submit.success'))
      await onSubmitSuccess()
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
        className="flex flex-col gap-3"
      >
        <h2 className="text-2xl">{pageT('title')}</h2>
        <ProductFormContent suppliers={suppliers ?? []} />
        <Button
          variant="primary"
          type="submit"
          form={id}
          disabled={!methods.formState.isValid || methods.formState.isSubmitting}
        >
          {pageT('submit')}
        </Button>
      </form>
    </FormProvider>
  )
}

export const EditProductModal = ({
  product,
  onSubmitSuccess,
  disclosure,
}: EditProductModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <EditProductForm product={product} onSubmitSuccess={onSubmitSuccess} close={close} />
    )}
  </Modal>
)

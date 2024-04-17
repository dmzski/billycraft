import { useI18n } from "@/i18n"
import { Button, Modal, useToast } from "@coco-ui/core"
import { ComponentProps, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { ProductFormContent, ProductFormValues } from "../components/ProductFormContent"
import { sendErrorToSentry } from "@/utils/errors"
import { ProductApi } from "@/api/ProductApi"
import Product from "@/models/Product"

type EditProductModalProps = {
  onSubmitSuccess: () => Promise<void>
  product: Product
  disclosure: ComponentProps<typeof Modal>['disclosure']
}

type EditProductFormProps = Omit<EditProductModalProps,
  'disclosure'
> & { close: () => void }

const EditProductForm = ({ product, onSubmitSuccess, close }: EditProductFormProps) => {
  const { scopedT, t } = useI18n()
  const toast = useToast()
  const pageT = scopedT('products.modals.edit')

  const initialValues: ProductFormValues = useMemo(() => ({
    name: product.name,
    description: product.description,
    price: product.price,
    type: product.type,
    supplierId: ""
  }), [product])
  
  const methods = useForm<ProductFormValues>({
    mode: "onChange",
    values: initialValues
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
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <h2 className="text-2xl">{pageT('title')}</h2>
        <ProductFormContent />
        <Button variant="primary" type="submit" disabled={!methods.formState.isValid || methods.formState.isSubmitting}>
          {pageT('submit')}
        </Button>
      </form>
    </FormProvider>
  )
}

export const EditProductModal = ({ product, onSubmitSuccess, disclosure }: EditProductModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <EditProductForm product={product} onSubmitSuccess={onSubmitSuccess} close={close} />
    )}
  </Modal>
)

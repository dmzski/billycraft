import { useI18n } from "@/i18n"
import { Button, Modal, useToast } from "@coco-ui/core"
import { ComponentProps } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { ProductFormContent, ProductFormValues } from "../components/ProductFormContent"
import { LineTypeEnum } from "@/models/LineTypeEnum"
import { sendErrorToSentry } from "@/utils/errors"
import { ProductApi } from "@/api/ProductApi"

type AddProductModalProps = {
  onSubmitSuccess: () => Promise<void>
  disclosure: ComponentProps<typeof Modal>['disclosure']
}

type AddProductFormProps = Pick<AddProductModalProps,
  'onSubmitSuccess'
> & { close: () => void }

const initialValues: ProductFormValues = {
  type: LineTypeEnum.ARTICLE,
  name: "",
  price: 0,
  description: "",
  supplierId: null
}

const AddProductForm = ({ onSubmitSuccess, close }: AddProductFormProps) => {
  const { scopedT, t } = useI18n()
  const toast = useToast()
  const pageT = scopedT('products.modals.add')

  const methods = useForm<ProductFormValues>({
    mode: "onChange",
    values: initialValues
  })

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await ProductApi.create(values)
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

export const AddProductModal = ({ onSubmitSuccess, disclosure }: AddProductModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <AddProductForm onSubmitSuccess={onSubmitSuccess} close={close} />
    )}
  </Modal>
)

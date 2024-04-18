import { useI18n } from '@/i18n'
import { Alert, Button, Input, Modal, useToast } from '@coco-ui/core'
import { ComponentProps } from 'react'
import { useController, useForm } from 'react-hook-form'
import { sendErrorToSentry } from '@/utils/errors'
import { ProductApi } from '@/api/ProductApi'
import Product from '@/models/Product'

type DeleteProductModalProps = {
  onSubmitSuccess: () => Promise<void>
  disclosure: ComponentProps<typeof Modal>['disclosure']
  product: Product
}

type DeleteProductFormProps = Omit<DeleteProductModalProps, 'disclosure'> & { close: () => void }

type ConfirmValues = {
  confirm: string
}

const DeleteProductForm = ({ product, onSubmitSuccess, close }: DeleteProductFormProps) => {
  const { scopedT, t } = useI18n()
  const toast = useToast()
  const pageT = scopedT('products.modals.delete')
  const confirmationString = t('forms.confirmation.delete.pattern')

  const methods = useForm<ConfirmValues>({
    mode: 'onChange',
    defaultValues: {
      confirm: '',
    },
  })

  const onSubmit = async () => {
    try {
      await ProductApi.delete(product.id)
      toast.success(pageT('submit.success'))
      await onSubmitSuccess()
      close()
    } catch (err) {
      sendErrorToSentry(err, { data: product.id })
      toast.error(t('genericFormError'))
    }
  }

  const { field: nameField, fieldState: nameFieldState } = useController({
    control: methods.control,
    name: 'confirm',
    rules: { required: true, pattern: new RegExp(confirmationString, 'i') },
  })

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <h2 className="text-2xl">{pageT('title')}</h2>
      <Alert variant="error">{pageT('description')}</Alert>
      <Input
        name={nameField.name}
        onChange={nameField.onChange}
        onBlur={nameField.onBlur}
        value={nameField.value}
        required
        ref={nameField.ref}
        label={t('forms.confirmation.delete.label')}
        autoComplete="off"
        error={nameFieldState.invalid}
      />
      <Button
        variant="error"
        type="submit"
        disabled={!methods.formState.isValid || methods.formState.isSubmitting}
      >
        {pageT('submit')}
      </Button>
    </form>
  )
}

export const DeleteProductModal = ({
  product,
  onSubmitSuccess,
  disclosure,
}: DeleteProductModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <DeleteProductForm product={product} onSubmitSuccess={onSubmitSuccess} close={close} />
    )}
  </Modal>
)

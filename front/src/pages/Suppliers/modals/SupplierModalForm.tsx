import { Button, Input, Modal, useToast } from '@coco-ui/core'
import { SupplierApi } from '@/api/SupplierApi'
import Supplier, { SupplierRequest } from '@/models/Supplier'
import { useEffect } from 'react'
import { useController, useForm } from 'react-hook-form'
import { TrashIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'

type SupplierModalFormProps = {
  supplier: Supplier
  onSubmitSuccess?: () => void | Promise<void>
  disclosure: JSX.Element
}

type SupplierFormProps = Omit<SupplierModalFormProps, 'disclosure'>

const SupplierForm = ({ supplier, onSubmitSuccess }: SupplierFormProps) => {
  const { t } = useI18n()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<SupplierRequest>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      color: '',
      vat: 0,
    },
  })

  const onSubmit = async (values: SupplierRequest) => {
    const data = {
      ...values,
      vat: Number(values.vat) || 0,
    }
    try {
      await (supplier.id ? SupplierApi.update(supplier.id, data) : SupplierApi.create(data))
      toast.success(t('suppliers.modals.form.submit.success'))
      await onSubmitSuccess?.()
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const handleDelete = async () => {
    if (supplier.id) {
      try {
        await SupplierApi.delete(supplier.id)
        toast.success(t('suppliers.modals.form.delete.success'))
        onSubmitSuccess?.()
      } catch {
        toast.error(t('genericFormError'))
      }
    }
  }

  useEffect(() => {
    if (reset && supplier) reset(supplier)
  }, [supplier, reset])

  const { field: nameField, fieldState: nameFieldState } = useController({
    control,
    name: 'name',
    rules: { required: true, minLength: 2 },
  })
  const { field: vatField, fieldState: vatFieldState } = useController({
    control,
    name: 'vat',
    rules: { required: true, min: 0, max: 100 },
  })
  const { field: colorField, fieldState: colorFieldState } = useController({
    control,
    name: 'color',
    rules: { required: true },
  })

  return (
    <div className="w-full pb-2 flex flex-col gap-4">
      <div className="flex border-b px-2 pb-2 pr-6">
        <h3 className="flex-grow text-xl">
          {supplier.id
            ? t('suppliers.modals.form.title.edit')
            : t('suppliers.modals.form.title.create')}
        </h3>
        <Button variant="error" className="gap-1" disabled={!supplier.id} onClick={handleDelete}>
          <TrashIcon className="w-5" />
          <span>{t('delete')}</span>
        </Button>
      </div>
      <form className="px-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          required
          name={nameField.name}
          onBlur={nameField.onBlur}
          onChange={nameField.onChange}
          ref={nameField.ref}
          label={t('suppliers.modals.form.field.name.label')}
          value={nameField.value}
          error={nameFieldState.invalid}
          minLength={2}
        />
        <Input
          required
          name={vatField.name}
          onBlur={vatField.onBlur}
          onChange={vatField.onChange}
          ref={vatField.ref}
          label={t('suppliers.modals.form.field.vat.label')}
          value={vatField.value}
          error={vatFieldState.invalid}
          type="number"
          min={0}
          max={100}
        />
        <div className="flex items-center gap-2">
          <Input
            required
            name={colorField.name}
            onBlur={colorField.onBlur}
            onChange={colorField.onChange}
            ref={colorField.ref}
            className="flex-grow"
            label={t('suppliers.modals.form.field.color.label')}
            value={colorField.value}
            error={colorFieldState.invalid}
          />
          <input
            type="color"
            value={colorField.value}
            onChange={colorField.onChange}
            onBlur={colorField.onBlur}
          />
        </div>
        <Button
          disabled={!isValid || isSubmitting}
          variant="primary"
          className="w-full"
          type="submit"
        >
          {t('save')}
        </Button>
      </form>
    </div>
  )
}
const SupplierModalForm = ({ disclosure, supplier, onSubmitSuccess }: SupplierModalFormProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <SupplierForm
        supplier={supplier}
        onSubmitSuccess={async () => {
          await onSubmitSuccess?.()
          close()
        }}
      />
    )}
  </Modal>
)

export default SupplierModalForm

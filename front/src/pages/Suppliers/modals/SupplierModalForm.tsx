import { Button, Input, Modal, useToast } from '@coco-ui/core'
import { SupplierApi } from '@/api/SupplierApi'
import { STRINGS } from '@/constants/strings'
import Supplier, { SupplierRequest } from '@/models/Supplier'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TrashIcon } from '@heroicons/react/24/solid'

type SupplierModalFormProps = {
  supplier: Supplier
  onSubmitSuccess?: (data: Supplier) => void | Promise<void>
  disclosure: JSX.Element
}
const SupplierModalForm = ({
  disclosure,
  supplier,
  onSubmitSuccess,
}: SupplierModalFormProps) => {
  const toast = useToast()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<SupplierRequest>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      color: '',
      vat: 0,
    },
    shouldUnregister: true,
  })

  const onSubmit = useCallback(
    (close: () => void) => async (values: SupplierRequest) => {
      const data = {
        ...values,
        vat: Number(values.vat) || 0,
      }
      try {
        const res = supplier.id
          ? await SupplierApi.update(supplier.id, data)
          : await SupplierApi.create(data)
        toast.success(STRINGS.SAVE_SUCCESS)
        onSubmitSuccess?.(res)
        close()
      } catch {
        toast.error(STRINGS.SAVE_ERROR)
      }
    },
    [toast, onSubmitSuccess, supplier],
  )

  const handleDelete = useCallback(() => {
    const deleteFn = async () => {
      if (supplier.id) {
        try {
          await SupplierApi.delete(supplier.id)
          toast.success(STRINGS.DELETE_SUCCESS)
          onSubmitSuccess?.(supplier)
        } catch {
          toast.error(STRINGS.DELETE_ERROR)
        }
      }
    }
    deleteFn()
  }, [supplier, onSubmitSuccess, toast])

  useEffect(() => {
    if (reset && supplier) reset(supplier)
  }, [supplier, reset])

  return (
    <Modal disclosure={disclosure}>
    {({close}) => (
    <div className="w-full pb-2">
      <div className="flex border-b px-2 pb-2 mb-4 pr-6">
        <h3 className="flex-grow text-xl">
          {supplier.id ? 'Modifier un fournisseur' : 'Ajouter un fournisseur'}
        </h3>
        <Button variant="error" disabled={!supplier.id} onClick={handleDelete}>
          <TrashIcon />
          &nbsp; Supprimer
        </Button>
      </div>
      <form className="px-4" onSubmit={handleSubmit(onSubmit(close))}>
        <Controller
          control={control}
          name="name"
          rules={{ required: true, minLength: 2 }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              required
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              ref={field.ref}
              className="mb-4"
              label="Nom du fournisseur"
              value={field.value}
              error={invalid}
              minLength={2}
            />
          )}
        />
        <Controller
          control={control}
          name="vat"
          rules={{ required: true, min: 0, max: 100 }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              required
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              ref={field.ref}
              className="mb-4"
              label="TVA appliquée par le fournisseur (%)"
              value={field.value}
              error={invalid}
              type="number"
              min={0}
              max={100}
            />
          )}
        />
        <Controller
          control={control}
          name="color"
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <div className="flex items-center">
              <Input
                required
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                ref={field.ref}
                className="mb-4 flex-grow"
                label="Couleur hexadécimale associée"
                value={field.value}
                error={invalid}
              />
              <input
                type="color"
                className=" ml-2"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </div>
          )}
        />
        <Button
          disabled={!isValid || isSubmitting}
          variant="primary"
          className="w-full"
          type="submit"
        >
          Enregistrer
        </Button>
      </form>
    </div>
    )}
    </Modal>
  )
}

export default SupplierModalForm

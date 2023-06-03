import { useCallback, useEffect } from 'react'
import { useQueryCache } from 'react-query'
import { CompanyApi } from 'api/CompanyApi'
import { Button, Input, TextArea, useToast } from '@coco-ui/core'
import Company from 'models/Company'
import { STRINGS } from 'constants/strings'
import { Controller, useForm } from 'react-hook-form'

type MyCompagnyFormProps = {
  company: Company
  onSubmitSuccess?: (res: Company) => void | Promise<void>
}
const MyCompagnyForm = ({ company, onSubmitSuccess }: MyCompagnyFormProps): JSX.Element => {
  const queryCache = useQueryCache()
  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: company,
  })

  const onSubmit = useCallback(
    async values => {
      try {
        const data = {
          ...values,
          articlesTax: Number(values.articlesTax) || 0,
          servicesTax: Number(values.servicesTax) || 0,
          othersTax: Number(values.othersTax) || 0,
        }
        const res = await CompanyApi.create(data)
        queryCache.invalidateQueries('my-information')
        queryCache.invalidateQueries('my-company')
        toast.success(STRINGS.SAVE_SUCCESS)
        onSubmitSuccess?.(res)
      } catch {
        toast.error(STRINGS.SAVE_ERROR)
      }
    },
    [company, toast, queryCache],
  )

  useEffect(() => {
    if (reset && company) {
      reset(company)
    }
  }, [company, reset])

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-xl border-b mb-4">Informations de mon entreprise</div>
        <div className=' md:pl-2 grid grid-cols-2 gap-x-4 gap-y-2'>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              label="Nom de l'entreprise"
              placeholder="Mon entreprise"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              required
            />
          )}
        />
        <Controller
          name="siret"
          control={control}
          rules={{required: true}}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="siret"
              label="SIRET"
              placeholder="SIRET"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              required
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <TextArea
              id="address"
              rows={3}
              
              label="Adresse"
              placeholder="Adresse"
              className='col-span-2'
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              required
            />
          )}
        />

        <Controller
          name="postalCode"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="postal-code"
              label="Code Postal"
              placeholder="Code Postal"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              required
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="city"
              label="Ville"
              placeholder="Ville"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              required
            />
          )}
        />

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="phone-number"
              label="Téléphone"
              placeholder="Téléphone"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="email"
              label="Email"
              placeholder="Email"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              required
            />
          )}
        />
        </div>


      <div className="flex flex-col gap-4 w-full mt-8">
        <div className="border-b text-lg">Taux d&apos;imposition</div>
        <div className="md:pl-2 grid md:grid-cols-3 gap-4">
          <Controller
            name="articlesTax"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                className="w-full"
                label="Imposition Ventes (%)"
                type="number"
                step={0.01}
                max={100}
                min={0}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={invalid}
              />
            )}
          />
          <Controller
            name="servicesTax"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                className="w-full"
                label="Imposition Services (%)"
                type="number"
                step={0.01}
                max={100}
                min={0}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={invalid}
              />
            )}
          />
          <Controller
            name="othersTax"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                className="w-full"
                label="Imposition Autres types de service (%)"
                step={0.01}
                max={100}
                min={0}
                type="number"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={invalid}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-2">
        Vous pourrez télécharger votre logo après la création de l&lsquo;entreprise dans vos
        paramètres
      </div>
      <Button type="submit" className="w-full mt-5" variant='primary' disabled={isSubmitting || !isValid}>
        Enregister
      </Button>
    </form>
  )
}

export default MyCompagnyForm

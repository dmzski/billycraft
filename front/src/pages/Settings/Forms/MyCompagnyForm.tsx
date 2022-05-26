import { ChangeEvent, useCallback, useEffect, useRef } from 'react'
import { useQueryCache } from 'react-query'
import useLoadingState from 'hooks/useLoadingState'
import { CompanyApi } from 'api/CompanyApi'
import { Button, Input, Switch, TextArea, useToast } from '@coco-ui/core'
import Company from 'models/Company'
import { STRINGS } from 'constants/strings'
import { Controller, useForm } from 'react-hook-form'
import { sendErrorToSentry } from 'utils/errors'

type MyCompagnyFormProps = {
  company: Company
  onSubmitSuccess?: (res: Company) => void | Promise<void>
}
const MyCompagnyForm = ({ company, onSubmitSuccess }: MyCompagnyFormProps): JSX.Element => {
  const queryCache = useQueryCache()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadLogoState = useLoadingState()
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    setValue,
    reset,
  } = useForm({
    mode: 'onBlur',
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
        const res = company?.id ? await CompanyApi.updateMine(data) : await CompanyApi.create(data)
        queryCache.invalidateQueries('my-information')
        queryCache.invalidateQueries('my-company')
        toast.success(STRINGS.SAVE_SUCCESS)
        onSubmitSuccess?.(res)
      } catch (error) {
        sendErrorToSentry(error)
        toast.error(STRINGS.SAVE_ERROR)
      }
    },
    [company, toast, queryCache],
  )

  const selectFileToUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const uploadLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    try {
      if (!uploadLogoState.isLoading && e.target?.files?.[0]) {
        uploadLogoState.update('loading')
        const url = await CompanyApi.uploadLogo(e.target.files[0])
        setValue('logo', url)
        uploadLogoState.update('idle')
        toast.success('Logo téléchargé avec succes. Enregistrer les modifications')
      }
    } catch (error) {
      sendErrorToSentry(error)
      toast.error("Erreur lors de l'upload de l'image")
      uploadLogoState.update('idle')
    }
  }

  useEffect(() => {
    if (reset && company) {
      reset(company)
    }
  }, [company, reset])

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-lg border-b mb-4">Informations de mon entreprise</div>
      <div className="md:pl-2 grid gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              variant="outside"
              label="Nom"
              placeholder="Nom"
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
          name="address"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <TextArea
              id="address"
              rows={3}
              variant="outside"
              label="Adresse"
              placeholder="Adresse"
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
          name="postalCode"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="postal-code"
              variant="outside"
              label="Code Postal"
              placeholder="Code Postal"
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
          name="city"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="city"
              variant="outside"
              label="Ville"
              placeholder="Ville"
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
          name="phoneNumber"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="phone-number"
              variant="outside"
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
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="email"
              variant="outside"
              label="Email"
              placeholder="Email"
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
          name="siret"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              id="siret"
              variant="outside"
              label="SIRET"
              placeholder="SIRET"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
            />
          )}
        />
        <div className="grid grid-cols-12 gap-4 mt-4">
          <Controller
            name="logo"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                variant="outside"
                label="URL du logo"
                className="col-span-12 md:col-span-9"
                placeholder="URL du logo"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={invalid}
              />
            )}
          />
          <Button
            className="col-span-12 md:col-span-3 md:mt-4"
            variant="inverted-primary"
            type="button"
            onClick={selectFileToUpload}
            disabled={uploadLogoState.isLoading}
          >
            Télécharger une image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            name="logo-upload"
            className="sr-only opacity-5"
            onChange={uploadLogo}
          />
        </div>
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
                variant="outside"
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
                variant="outside"
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
                variant="outside"
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
      <div>
        <h2 className="text-lg mb-4 border-b">Automatisme</h2>
        <div className="md:pl-2 grid md:grid-cols-2 gap-4">
          <div className="flex">
            <Controller
              name="autoMonthReport"
              rules={{}}
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} labelPosition="right">
                  Générer automatiquement les rapports mensuels
                </Switch>
              )}
            />
          </div>
          <div className="flex">
            <Controller
              name="autoYearReport"
              rules={{}}
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} labelPosition="right">
                  Générer automatiquement les rapports annuels
                </Switch>
              )}
            />
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full primary mt-4" disabled={!isValid || isSubmitting}>
        Enregister
      </Button>
    </form>
  )
}

export default MyCompagnyForm

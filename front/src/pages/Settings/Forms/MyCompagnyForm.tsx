import { ChangeEvent, useEffect, useRef } from 'react'
import useLoadingState from '@/hooks/useLoadingState'
import { CompanyApi } from '@/api/CompanyApi'
import { Button, Input, Switch, TextArea, useToast } from '@coco-ui/core'
import Company from '@/models/Company'
import { Controller, useForm } from 'react-hook-form'
import { useI18n } from '@/i18n'
import { useUser } from '@/providers/UserProvider'

type MyCompagnyFormProps = {
  company: Company
  onSubmitSuccess?: (res: Company) => void | Promise<void>
}
const MyCompagnyForm = ({ company, onSubmitSuccess }: MyCompagnyFormProps) => {
  const { t } = useI18n()
  const { reload } = useUser()
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

  const onSubmit = async (values: Company) => {
    try {
      const data = {
        ...values,
        articlesTax: Number(values.articlesTax) || 0,
        servicesTax: Number(values.servicesTax) || 0,
        othersTax: Number(values.othersTax) || 0,
      }
      const res = company?.id ? await CompanyApi.updateMine(data) : await CompanyApi.create(data)
      await reload()
      toast.success(t('settings.forms.myCompagnyForm.submit.success'))
      onSubmitSuccess?.(res)
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const selectFileToUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

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
    } catch {
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
      <div className="text-2xl border-b">{t('compagny informations')}</div>
      <div className="md:pl-2 flex flex-col gap-8">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              label={t('settings.forms.myCompagnyForm.name.label')}
              placeholder={t('settings.forms.myCompagnyForm.name.placeholder')}
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
              label={t('settings.forms.myCompagnyForm.address.label')}
              placeholder={t('settings.forms.myCompagnyForm.address.placeholder')}
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
              label={t('settings.forms.myCompagnyForm.postalCode.label')}
              placeholder={t('settings.forms.myCompagnyForm.postalCode.placeholder')}
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
              label={t('settings.forms.myCompagnyForm.city.label')}
              placeholder={t('settings.forms.myCompagnyForm.city.placeholder')}
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
              label={t('settings.forms.myCompagnyForm.phoneNumber.label')}
              placeholder={t('settings.forms.myCompagnyForm.phoneNumber.placeholder')}
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
              label={t('settings.forms.myCompagnyForm.email.label')}
              placeholder={t('settings.forms.myCompagnyForm.email.placeholder')}
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
              label={t('settings.forms.myCompagnyForm.siret.label')}
              placeholder={t('settings.forms.myCompagnyForm.siret.placeholder')}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
            />
          )}
        />
        <div className="grid grid-cols-12 gap-4 items-end">
          <Controller
            name="logo"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                label={t('settings.forms.myCompagnyForm.logo.label')}
                className="col-span-12 md:col-span-9"
                placeholder={t('settings.forms.myCompagnyForm.logo.placeholder')}
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
            variant="primary"
            outline
            type="button"
            onClick={selectFileToUpload}
            disabled={uploadLogoState.isLoading}
          >
            {t('Upload an picture')}
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
        <div className="border-b text-lg">{t('Tax rate')}</div>
        <div className="md:pl-2 grid md:grid-cols-3 gap-8">
          <Controller
            name="articlesTax"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                className="w-full"
                label={t('settings.forms.myCompagnyForm.articlesTax.label')}
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
                label={t('settings.forms.myCompagnyForm.servicesTax.label')}
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
                label={t('settings.forms.myCompagnyForm.othersTax.label')}
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
        <h2 className="text-lg mb-4 border-b">{t('Automation')}</h2>
        <div className="md:pl-2 flex flex-col items-start gap-8">
          <Controller
            name="autoMonthReport"
            rules={{}}
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} labelPosition="right">
                {t('Automatically generate monthly reports')}
              </Switch>
            )}
          />
          <Controller
            name="autoYearReport"
            rules={{}}
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} labelPosition="right">
                {t('Automatically generate annual reports')}
              </Switch>
            )}
          />
        </div>
      </div>
      <Button type="submit" variant="success" className="mt-4" disabled={!isValid || isSubmitting}>
        {t('save')}
      </Button>
    </form>
  )
}

export default MyCompagnyForm

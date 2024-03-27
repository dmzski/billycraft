import { Button, Input, useToast } from '@coco-ui/core'
import { SUPPORT_EMAIL } from '@/constants/global'
import { useI18n } from '@/i18n'
import { Controller, useForm } from 'react-hook-form'

type JoinOrganizationFormValues = {
  code: string
}

export const JoinOrganization = () => {
  const { t } = useI18n()
  const toast = useToast()
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<JoinOrganizationFormValues>({
    mode: 'onChange',
  })

  const onSubmit = async () => {
    toast.success(t('onboarding.join.success'))
  }

  return (
    <>
      <p className="text-center">
        {t('underDevelopment')}&nbsp;
        <a className="link link-info" href={`mailto:${SUPPORT_EMAIL}`}>
          {t('contactSupport')}
        </a>
      </p>
      <form className="blur-sm flex flex-col gap-4 items-center" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-3xl font-bold text-center">{t('onboarding.join.title')}</h2>
        <p>{t('onboarding.join.description')}</p>
        <Controller
          name="code"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              disabled
              label={t('onboarding.join.fields.code.label')}
              placeholder="1AZ56BI67891"
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
        <Button variant="primary" type="submit" disabled={!isValid || !isSubmitting}>
          {t('onboarding.join.submit')}
        </Button>
      </form>
    </>
  )
}

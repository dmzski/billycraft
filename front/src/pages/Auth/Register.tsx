import { Button, Checkbox, Input, Link, useToast } from '@coco-ui/core'
import { SUPPORT_EMAIL } from '@/constants/global'
import { useI18n } from '@/i18n'
import { ApiError } from '@/models/ApiError'
import { useAuth } from '@/providers/AuthProvider'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { sendErrorToSentry } from '@/utils/errors'
import { RRLink } from '@/components/RRLink'

type RegisterFormValues = {
  email: string
  password: string
  name: string
  tos: boolean
}

export const Register = () => {
  const { t } = useI18n()
  const { register } = useAuth()
  const toast = useToast()
  const { push } = useHistory()

  const initialValues = useMemo(
    () =>
      ({
        name: '',
        email: '',
        password: '',
        tos: false,
      } as RegisterFormValues),
    [],
  )

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm({
    values: initialValues,
    mode: 'onChange',
    shouldUseNativeValidation: true,
  })
  const onSubmit = async (params: RegisterFormValues) => {
    try {
      await register(params)
      toast.show(t('register.success'))
      push(ROUTES.LOGIN.path())
    } catch (err) {
      if (!(err instanceof ApiError) || err.code === 500) {
        sendErrorToSentry(err)
      }
      if (err instanceof ApiError) {
        toast.destructive(err.message)
      } else {
        toast.destructive(t('genericFormError'))
      }
    }
  }
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-4">
      <h1 className="text-5xl text-center">{t('appName')}</h1>
      <div className="md:w-1/3">
        <form className="border rounded p-8 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-3xl text-center">{t('register.title')}</h2>
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input
                  required
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="email"
                  type="email"
                  label={t('register.fields.email.label')}
                  name="email"
                  placeholder="email@exemple.com"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input
                  required
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="password"
                  type="password"
                  label={t('register.fields.password.label')}
                  name="password"
                  placeholder="*******"
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input
                  required
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="fullName"
                  type="text"
                  label={t('register.fields.name.label')}
                  name="name"
                  placeholder="John Doe"
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="tos"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Checkbox
                    name={field.name}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    labelPosition="right"
                  />
                  <Link href="/tos.txt" target="_blank">
                    {t('register.fields.tos.label')}
                  </Link>
                </div>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {t('register.submit')}
            </Button>
            <div className="flex justify-center">
              <RRLink to={ROUTES.LOGIN.path}>{t('login.title')}</RRLink>
            </div>
          </div>
        </form>
        <small className="text-xs">
          {t('supportPrefix')}
          <Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
        </small>
      </div>
    </div>
  )
}

import { Alert, Button, Input, useToast } from '@coco-ui/core'
import { SUPPORT_EMAIL } from '@/constants/global'
import { useI18n } from '@/i18n'
import { ApiError } from '@/models/ApiError'
import { useAuth } from '@/providers/AuthProvider'
import { Controller, useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { sendErrorToSentry } from '@/utils/errors'

type LoginFormValues = {
  email: string
  password: string
}

export const Login = () => {
  const { login } = useAuth()
  const { push } = useHistory()
  const toast = useToast()
  const { control, handleSubmit } = useForm<LoginFormValues>({
    mode: 'onChange',
    values: {
      password: '',
      email: '',
    },
    shouldUseNativeValidation: true,
  })
  const { t } = useI18n()

  const onSubmit = async ({ password, email }: LoginFormValues) => {
    try {
      await login({ email, password })
      toast.success(t('login.success'))
      push(ROUTES.DASHBOARD.path)
    } catch (err) {
      if (!(err instanceof ApiError) || err.code === 500) {
        sendErrorToSentry(err)
      }
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error(t('genericFormError'))
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-4">
      <h1 className="text-5xl text-center">{t('appName')}</h1>
      <div className="flex md:w-1/2">
        <Alert variant="warning">{t('login.migrationMotd')}</Alert>
      </div>
      <div className="md:w-1/3">
        <form className="border rounded p-8 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-3xl text-center">{t('login.title')}</h2>
          <div className="flex flex-col">
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
                  label={t('login.fields.email.label')}
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
                  label={t('login.fields.password.label')}
                  name="password"
                  placeholder="*******"
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="primary" type="submit">
              {t('login.submit')}
            </Button>
            <div className="flex justify-center">
              <Link to={ROUTES.REGISTER.path} className="link link-info">
                {t('login.register')}
              </Link>
            </div>
          </div>
        </form>
        <small className="text-xs">
          {t('supportPrefix')}
          <a className="link" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </small>
      </div>
    </div>
  )
}

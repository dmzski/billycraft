import { Button, Input, useToast } from "@coco-ui/core"
import { SUPPORT_EMAIL } from "@/constants/global"
import { useI18n } from "@/i18n"
import { ApiError } from "@/models/ApiError"
import { useAuth } from "@/providers/AuthProvider"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useHistory } from "react-router-dom"
import { ROUTES } from "@/routes"
import { sendErrorToSentry } from "@/utils/errors"

type RegisterFormValues = {
  email: string,
  password: string,
  name: string
}

export const Register = () => {
  const { t } = useI18n()
  const { register } = useAuth()
  const toast = useToast()
  const { push } = useHistory()

  const initialValues = useMemo(() => ({
    name: "",
    email: "",
    password: "",
  } as RegisterFormValues), [])

  const { control, handleSubmit } = useForm({
    values: initialValues,
    mode: "onChange",
    shouldUseNativeValidation: true
  })
  const onSubmit = async (params: RegisterFormValues) => {
    try {

      await register(params)
      toast.success(t('register.success'))
      push(ROUTES.LOGIN.path)
    } catch (err) {
      if (!(err instanceof ApiError) || err.code === 500){
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
      <h1 className="text-3xl text-center">{t('appName')}</h1>
      <div>
        <form className="border rounded p-8 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-3xl text-center">{t('register.title')}</h2>
          <div className="flex flex-col">
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input required onChange={field.onChange} onBlur={field.onBlur} autoComplete="email" type="email" label={t('register.fields.email.label')} name="email" placeholder="email@exemple.com" />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input required onChange={field.onChange} onBlur={field.onBlur} autoComplete="password" type="password" label={t('register.fields.password.label')} name="password" placeholder="*******" />
              )}
            />
            <Controller
              control={control}
              name="name"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Input required onChange={field.onChange} onBlur={field.onBlur} autoComplete="fullName" type="text" label={t('register.fields.name.label')} name="name" placeholder="John Doe" />
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="primary" type="submit">{t('register.submit')}</Button>
            <div className="flex justify-center">
              <Link to={ROUTES.LOGIN.path} className="link link-info">{t('login.title')}</Link>
            </div>
          </div>
        </form>
        <small className="text-xs">{t('supportPrefix')}<a className="link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></small>
      </div>
    </div>
  )
}

import { useI18n } from "@/i18n"
import { useForm } from "react-hook-form"

export const MySettings = () => {
  const {scopedT} = useI18n()
  const pageT = scopedT('mySettings')
  const methods = useForm()

  return (
    <div className="flex flex-col gap-2">
      <h1>{pageT('title')}</h1>
    </div>
  )
}


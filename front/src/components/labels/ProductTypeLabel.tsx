import { LINE_TYPE } from '@/constants/line'
import { useI18n } from '@/i18n'
import Product from '@/models/Product'

type ProductTypeLabelProps = {
  type: Product['type']
  short?: boolean
}

export const ProductTypeLabel = ({ type, short }: ProductTypeLabelProps) => {
  const { scopedT } = useI18n()
  const t = scopedT(`products.type.${type}`)
  const IconComponent = LINE_TYPE[type].icon

  return (
    <span className="inline-flex gap-2 items-center">
      <IconComponent className="w-5" title={t('label')} />
      {!short ? <span>{t('label')}</span> : null}
    </span>
  )
}

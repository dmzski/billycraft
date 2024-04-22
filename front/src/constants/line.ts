import { LineTypeEnum } from '@/models/LineTypeEnum'
import {
  HandRaisedIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/solid'

export const LINE_TYPE: Record<
  LineTypeEnum,
  { enum: LineTypeEnum; name: string; icon: typeof ShoppingBagIcon }
> = {
  ARTICLE: { enum: LineTypeEnum.ARTICLE, name: 'Matériel', icon: ShoppingBagIcon },
  SERVICE: {
    enum: LineTypeEnum.SERVICE,
    name: 'Service commercial ou artisanal',
    icon: HandRaisedIcon,
  },
  OTHER_SERVICE: {
    enum: LineTypeEnum.OTHER_SERVICE,
    name: 'Autre type de service',
    icon: QuestionMarkCircleIcon,
  },
  TEXT: { enum: LineTypeEnum.TEXT, name: 'Texte', icon: PencilIcon },
}

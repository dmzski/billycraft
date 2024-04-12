import { HandRaisedIcon, PencilIcon, QuestionMarkCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";

export const LINE_TYPE = {
  ARTICLE: { enum: 'ARTICLE', name: 'Matériel', icon: ShoppingBagIcon },
  SERVICE: { enum: 'SERVICE', name: 'Service commercial ou artisanal', icon: HandRaisedIcon },
  OTHER_SERVICE: { enum: 'OTHER_SERVICE', name: 'Autre type de service', icon: QuestionMarkCircleIcon },
  TEXT: { enum: 'TEXT', name: 'Texte', icon: PencilIcon },
}

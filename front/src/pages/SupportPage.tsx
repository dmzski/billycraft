import { Icon } from '@coco-ui/core'

const SupportPage = (): JSX.Element => (
  <div className="m-2">
    <h2 className="font-bold text-2xl leading-tight mb-4">Un problème ? contactez nous !</h2>
    <a className="ml-4 flex items-center text-blue-700 mb-2" href="mailto:contact@coco-erp.fr">
      <Icon name="mail" className="mr-2" /> <span>contact@coco-erp.fr</span>
    </a>
    <a className="ml-4 flex items-center text-blue-700" href="tel:0619755845">
      <Icon name="phone" className="mr-2" /> <span>06 19 75 58 45</span>
    </a>
  </div>
)

export default SupportPage

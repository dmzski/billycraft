import { useI18n } from '@/i18n'
import { Link, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { CreateOrganization } from './CreateOrganization'
import { JoinOrganization } from './JoinOrganization'
import { Button } from '@coco-ui/core'

export const Onboarding = () => {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <div className="p-5 py-10 flex flex-col gap-4 items-center bg-accent shadow-xl text-accent-foreground">
        <h1 className="text-6xl font-bold">{t('onboarding.home.title')}</h1>
        <p>{t('onboarding.home.description')}</p>
      </div>
      <div className="rounded p-5 bg-background flex flex-col gap-6 px-5 md:px-10 pb-5 items-center">
        <div className="grid grid-cols-2 gap-4">
          <Button asChild>
            <Link to={ROUTES.ONBOARDING_CREATE.path}>{t('onboarding.home.button.create')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.ONBOARDING_JOIN.path}>{t('onboarding.home.button.join')}</Link>
          </Button>
        </div>
        <Switch>
          <Route path={ROUTES.ONBOARDING_CREATE.path()} component={CreateOrganization} />
          <Route path={ROUTES.ONBOARDING_JOIN.path()} component={JoinOrganization} />
          <Route component={CreateOrganization} />
        </Switch>
      </div>
    </div>
  )
}

export default Onboarding

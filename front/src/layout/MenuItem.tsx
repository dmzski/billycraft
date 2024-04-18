import { useI18n } from '@/i18n'
import { RouteId } from '@/routes'
import clsx from 'clsx'
import { Link, useRouteMatch } from 'react-router-dom'

type MenuItemProps = {
  path: string
  exact?: boolean
  id: RouteId
}
const MenuItem = ({ path, exact, id }: MenuItemProps) => {
  const { t } = useI18n()
  const match = useRouteMatch({
    path,
    exact,
  })

  return (
    <li>
      <Link
        to={path}
        className={clsx(
          'focus:text-primary focus:bg-primary-content',
          match ? 'bg-primary-content text-primary' : '',
        )}
      >
        {t(`heads.${id}`)}
      </Link>
    </li>
  )
}

export default MenuItem

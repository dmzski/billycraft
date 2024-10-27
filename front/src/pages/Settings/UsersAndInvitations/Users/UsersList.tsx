import { useI18n } from '@/i18n'
import { User } from '@/models/User'
import { Button } from '@coco-ui/core'
import { TrashIcon } from '@heroicons/react/24/solid'
import { RemoveUserModal } from './modals/RemoveUserModal'
import clsx from 'clsx'
import { useUser } from '@/providers/UserProvider'

type UsersListProps = {
  users: User[]
  reload: () => Promise<void>
}
export const UsersList = ({ users, reload }: UsersListProps) => {
  const { scopedT, t } = useI18n()
  const { user } = useUser()
  const pageT = scopedT('settings.users.users.list')

  return (
    <table className="flex flex-col py-2">
      <thead>
        <tr className="text-left [&_>_th]:font-semibold px-4 py-2 md:h-16 items-center grid md:grid-cols-12 gap-3 bg-accent text-accent-foreground rounded-t border border-primary overflow-hidden">
          <th className="md:col-span-3">{pageT('headers.email')}</th>
          <th className="md:col-span-3">{pageT('headers.name')}</th>
          <th className="md:col-span-3">{pageT('headers.role')}</th>
          <th className="md:col-span-3" />
        </tr>
      </thead>
      {users && users.length > 0 ? (
        <tbody>
          {users.map(({ email, lastName, firstName, role }) => (
            <tr
              className={clsx('px-4 py-2 gap-3 grid md:grid-cols-12 border-b items-center md:h-16')}
            >
              <td className="md:col-span-3">{email}</td>
              <td className="md:col-span-3">
                {lastName || firstName ? `${lastName} ${firstName}` : '-'}
              </td>
              <td className="md:col-span-3">{t(`roles.${role}`)}</td>
              <td className="md:col-span-3 md:flex md:justify-end">
                {role !== 'OWNER' && email !== user?.email ? (
                  <RemoveUserModal
                    onSubmitSuccess={reload}
                    email={email}
                    disclosure={
                      <Button variant="destructive">
                        <TrashIcon />
                      </Button>
                    }
                  />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr className="grid md:grid-cols-12">
            <td className="md:col-span-12 text-center">{pageT('emptyText')}</td>
          </tr>
        </tbody>
      )}
    </table>
  )
}

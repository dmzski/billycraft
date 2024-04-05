import MyCompagnyForm from './Forms/MyCompagnyForm'
import { useMyOrganizationQuery } from '@/queries/useMyOrganizationQuery'

const MyCompanyPage = () => {
  const { data: company, reload } = useMyOrganizationQuery()

  return (
    <div>
      {company ? (
        <MyCompagnyForm
          company={company}
          onSubmitSuccess={async () => {
            await reload()
          }}
        />
      ) : null}
    </div>
  )
}

export default MyCompanyPage

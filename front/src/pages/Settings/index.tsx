import { Loader } from '@coco-ui/core'
import { CompanyApi } from 'api/CompanyApi'
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import Company from 'models/Company'
import MyCompagnyForm from './Forms/MyCompagnyForm'
import BillTab from './BillTab'
import QuoteTab from './QuoteTab'

const Settings = (): JSX.Element => {
  const [tab, setTab] = useState('company')
  const companyQuery = useQuery('my-company', CompanyApi.getMine, {
    enabled: tab === 'company',
    refetchOnWindowFocus: false,
  })

  const [company, setCompany] = useState<Company>({} as Company)

  const changeTab = (newTab: string) => () => {
    setTab(newTab)
  }

  useEffect(() => {
    if (companyQuery.data) {
      setCompany(companyQuery.data)
    }
  }, [companyQuery])

  return (
    <div className="w-full">
      <h1 className="text-3xl">Paramètres</h1>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="mt-4 flex w-full justify-center items-center mb-4">
          <button
            type="button"
            onClick={changeTab('company')}
            className={`appearance-none cursor-pointer hover:font-bold p-3 w-1/3 text-center shadow rounded ${
              tab === 'company' && 'bg-primary-600 text-white'
            }`}
          >
            Mon entreprise
          </button>
          <button
            type="button"
            onClick={changeTab('quote')}
            className={`appearance-none cursor-pointer hover:font-bold p-3 w-1/3 mx-2 text-center shadow rounded ${
              tab === 'quote' && 'bg-primary-600 text-white'
            }`}
          >
            Personnalisation des devis
          </button>
          <button
            type="button"
            onClick={changeTab('bill')}
            className={`appearance-none cursor-pointer hover:font-bold p-3 w-1/3 text-center shadow rounded ${
              tab === 'bill' && 'bg-primary-600 text-white'
            }`}
          >
            Personnalisation des factures
          </button>
        </div>
        <div className="flex flex-col w-full justify-center items-center">
          {tab === 'company' && (
            <>
              {companyQuery.data && (
                <div className="w-full">
                  <MyCompagnyForm company={company} setCompany={setCompany} />
                </div>
              )}
              {companyQuery.isLoading && (
                <div className="mt-2 flex justify-center">
                  <Loader />
                </div>
              )}
              {companyQuery.isError && <div>Une erreur est survenue</div>}
            </>
          )}
          {tab === 'quote' && <QuoteTab />}
          {tab === 'bill' && <BillTab />}
        </div>
      </div>
    </div>
  )
}

export default Settings

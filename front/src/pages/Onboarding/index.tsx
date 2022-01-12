import Company from 'models/Company'
import MyCompagnyForm from './Forms/MyCompagnyForm'

const Onboarding = (): JSX.Element => (
  <div className="flex items-center justify-center from-primary-500 to-primary-300 bg-gradient-to-t min-h-screen min-w-full">
    <div className="bg-white flex items-center flex-col p-5 rounded-lg shadow-2xl">
      <div className="text-4xl pb-3">
        <h1>Bienvenue dans votre espace 🚀</h1>
      </div>

      <div className="text-gray-600">
        <p>
          Créer votre entreprise pour commencer à utiliser l&lsquo;outil renseigner les informations
          concernant votre entreprise
        </p>
      </div>

      <div className="w-full mt-3">
        <MyCompagnyForm company={{} as Company} />
      </div>
    </div>
  </div>
)

export default Onboarding

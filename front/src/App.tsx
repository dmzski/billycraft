import { BrowserRouter } from 'react-router-dom'
import MainProvider from './providers/MainProvider'
import { MainSwitch } from './pages/MainSwitch'

const App = () => (
  <BrowserRouter>
    <MainProvider>
      <MainSwitch />
    </MainProvider>
  </BrowserRouter>
)

export default App

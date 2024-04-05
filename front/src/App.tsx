import { BrowserRouter } from 'react-router-dom'
import MainProvider from './providers/MainProvider'
import PrivateSwitch from './pages/PrivateSwitch'

const App = () => (
  <BrowserRouter>
    <MainProvider>
      <PrivateSwitch />
    </MainProvider>
  </BrowserRouter>
)

export default App

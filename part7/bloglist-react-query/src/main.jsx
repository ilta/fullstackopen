import ReactDOM from 'react-dom/client'
import App from './App'
import { NotifyContextProvider } from '../NotifyContext'
import { UserContextProvider } from '../UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotifyContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </NotifyContextProvider>
  </QueryClientProvider>
)

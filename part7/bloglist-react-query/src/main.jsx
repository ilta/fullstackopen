import ReactDOM from 'react-dom/client'
import App from './App'
import { NotifyContextProvider } from '../NotifyContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotifyContextProvider>
      <App />
    </NotifyContextProvider>
  </QueryClientProvider>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider,QueryClient} from "@tanstack/react-query"
import { AppContextProvider } from "./contexts/AppContext.tsx"
import { SearchContextprovider } from './contexts/Searchcontext.tsx'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextprovider>
       <App />
       </SearchContextprovider>
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)

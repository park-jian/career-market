//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();
// if (process.env.NODE_ENV === 'development') {
//   import('./mocks/browser').then(({ worker }) => {
//     worker.start({
//       onUnhandledRequest: 'bypass',
//     })
//   })
// }
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Router>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
    </Router>
  // </StrictMode>,
)



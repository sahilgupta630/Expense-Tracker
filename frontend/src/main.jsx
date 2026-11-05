import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/Context/AuthProvider.jsx'
import MainRouter from './MainRouter.jsx'
import axios from 'axios'

// Send the login token with every axios request, so API calls that don't set
// the Authorization header themselves (e.g. groups and bills) are still authenticated.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

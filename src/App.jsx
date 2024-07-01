import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import LandingPage from './pages/landing'
import Dashboard from './pages/dashboard'
import Auth from './pages/auth'
import Link from './pages/link'
import RedirectLink from './pages/redirect-link'
import UrlProvider from './context'
// import supabase from './db/supabase'

function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <LandingPage />
        },
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/auth',
          element: <Auth />
        },
        {
          path: '/link/:id',
          element: <Link />
        },
        {
          path: '/:id',
          element: <RedirectLink />
        },
      ]
    }
  ])


  return (
    <UrlProvider>
      <RouterProvider router={router}/>
    </UrlProvider>
  )
}

export default App

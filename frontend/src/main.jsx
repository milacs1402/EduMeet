import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence } from 'framer-motion';
import './styles/index.css'
import Home from './routes/Home.jsx'  
import Cadastro from './routes/Cadastro.jsx'
import Cover from './routes/Cover.jsx'
import Busca from './routes/Busca.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Cover />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "cadastro",
    element: <Cadastro />
  },
  {
    path: "busca",
    element: <Busca />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnimatePresence mode='wait'>
        <RouterProvider router={router} />
    </AnimatePresence>

  </StrictMode>,
)

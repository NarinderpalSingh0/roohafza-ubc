import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/typography.css'
import './styles/sections.css'
import './styles/cards.css'
import './styles/animations.css'
import './styles/build-configurator.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider/theme-provider.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <App />
      </ThemeProvider>
    </BrowserRouter>
)

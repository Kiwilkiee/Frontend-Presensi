import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ini penting untuk modal!
import 'font-awesome/css/font-awesome.min.css' // Jika pakai Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css'


import App from './App.jsx'
import '../src/css/index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

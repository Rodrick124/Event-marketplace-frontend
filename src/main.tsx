import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const initialPayPalOptions = {
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <PayPalScriptProvider options={initialPayPalOptions}>
          <CartProvider>
            <App />
          </CartProvider>
        </PayPalScriptProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
)

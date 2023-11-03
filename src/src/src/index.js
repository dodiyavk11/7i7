import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    
    <>
      <BrowserRouter>
        {/* <Elements stripe={stripePromise}> */}
            <App />
            {/* </Elements>    */}
        </BrowserRouter>
    </>
  );



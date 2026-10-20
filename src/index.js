import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {Provider} from "react-redux"
import { combinedreducer } from './store';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer:combinedreducer
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4200,
          style: {
            border: "1px solid #e6e8f0",
            borderRadius: "12px",
            background: "#ffffff",
            color: "#20233b",
            boxShadow: "0 12px 30px -20px rgba(32, 35, 59, .3)",
            fontSize: "14px",
          },
        }}
      />
      <Provider store={store}>
      <App />
      </Provider>
        
      </BrowserRouter>
  
  </React.StrictMode>
);

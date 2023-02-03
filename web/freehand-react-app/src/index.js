import React, {  Suspense } from "react";
import ReactDOM from 'react-dom/client';

import logo from "./logo.svg";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img src={logo} alt="logo" width="100%" height="100%" />
    <div>loading...</div>
  </div>
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>

    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

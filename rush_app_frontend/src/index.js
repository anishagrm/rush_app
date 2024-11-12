import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios'
// makes it easier for our endpoint calls by setting a default base axios url

// Uncomment this line for deployment 
axios.defaults.baseURL = 'https://us-central1-rush-app-46833.cloudfunctions.net/api'

// Uncomment this line when developing locally 
// axios.defaults.baseURL = 'http://localhost:5000/rush-app-46833/us-central1/api'

ReactDOM.render(
  // <React.StrictMode>
    <App />,
  /* </React.StrictMode>, */
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

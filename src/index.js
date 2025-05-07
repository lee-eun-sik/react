import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======
import ReactDOM from 'react-dom';
import App from './App'; // Ensure you have an App component in src/App.js

// Render the App component into the root div
ReactDOM.render(
  <React.StrictMode>
	<App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure your public/index.html has a div with id="root"
);
>>>>>>> 29fe17261a49fa81bef4e3778576a70951560fed

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure you have an App component in src/App.js

// Render the App component into the root div
ReactDOM.render(
  <React.StrictMode>
	<App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure your public/index.html has a div with id="root"
);

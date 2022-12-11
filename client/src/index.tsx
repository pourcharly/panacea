import * as dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Helmet } from "react-helmet";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

dotenv.config()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Helmet>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      {/*<script src="/script/buffer.umd.js"></script>*/}
    </Helmet>
    <App />
  </React.StrictMode>
);

reportWebVitals();

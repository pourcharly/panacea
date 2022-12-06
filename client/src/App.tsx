import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Router, RouterOutlet, routes } from './routing';
import { QRCode } from 'react-qrcode-logo';
import IpfsService from './services/IpfsService';

/*(async () => {
  const service = new IpfsService();
  await service.init();
  const results = await service.add('Hello IPFS World!');
  console.log(results.cid.toString());
  const data = await service.get(results.cid.toString());
  console.log(data);
})();*/

function App() {

  return (
    <div className="App">
      <Router routes={ routes }>

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <QRCode value="http:/www.google.com/fr"/>
        </header>

        <RouterOutlet/>

      </Router>
    </div>
  );
}

export default App;

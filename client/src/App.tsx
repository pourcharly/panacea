import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { QRCode } from 'react-qrcode-logo';
import * as IPFS from 'ipfs-core';

(async () => {
  const node = await IPFS.create({ repo: 'Panacea' }).catch(() => console.log('Panacea IPFS Node already exists.'));
  if (node) {
    let data = 'Hello, <YOUR NAME HERE>';
    const results = await node.add(data);

    console.log(results.cid.toString());

    const stream = node.cat('QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A');
    const decoder = new TextDecoder();
    data = '';

    for await (const chunk of stream) {
      // chunks of data are returned as a Uint8Array, convert it back to a string
      data += decoder.decode(chunk, { stream: true });
    }

    console.log(data);
  }

})();

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <QRCode value="http:/www.google.com/fr"/>
      </header>
    </div>
  );
}

export default App;

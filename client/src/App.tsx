import './App.scss';
import { useEffect } from 'react';
import { Router, RouterOutlet, routes } from './routing';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';

import { IpfsService } from './services';
import { AppContext, AppProvider } from './contexts';
import { AppHeader } from './components/AppHeader';

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
    <div id="app_root" className="App">
      <AppProvider>
        <ThemeProvider theme={ theme }>
          <CssBaseline/>
          <AppHeader/>

          <Router routes={ routes } AppContext={ AppContext }>

            <Container maxWidth="lg" sx={{ paddingTop: '100px'}}>

              <RouterOutlet/>

            </Container>

          </Router>
        </ThemeProvider>
      </AppProvider>
    </div>
  );
}

export default App;

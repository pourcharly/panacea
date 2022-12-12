import './App.scss';
import { Router, RouterOutlet, routes } from './routing';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { AppContext, AppProvider } from './contexts';
import { AppHeader } from './components/AppHeader';



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

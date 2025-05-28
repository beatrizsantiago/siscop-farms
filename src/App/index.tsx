import { theme } from 'agro-core';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import GoogleMapsWrapper from '@components/GoogleMapsWrapper';

import { FarmProvider } from './context';
import Main from './Main';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
      <FarmProvider>
        <GoogleMapsWrapper>
          <Main />
        </GoogleMapsWrapper>
      </FarmProvider>
    <ToastContainer />
  </ThemeProvider>
);

export default App;

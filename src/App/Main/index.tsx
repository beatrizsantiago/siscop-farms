import { Box } from '@mui/material';

import Map from '../Map';
import Add from '../Add';
import Search from './components/Search';

const Main = () => (
  <Box padding={2}>
    <Box display="flex" justifyContent="space-between" marginBottom={3}>
      <Search />
      <Add />
    </Box>
    <Map />
  </Box>
);

export default Main;

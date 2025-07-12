import { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useFarmContext } from '@App/context';
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';

import MakerInfo from './components/MakerInfo';

const Map = () => {
  const theme = useTheme();
  const isBigScreens = useMediaQuery(theme.breakpoints.up('md'));
  
  const { state } = useFarmContext();

  const [selectedFarmIndex, setSelectedFarmIndex] = useState<number | null>(null);

  const center = state.farms[0]?.geolocation || { _lat: 0, _long: 0 };

  if (state.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    )
  };

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: isBigScreens ? '70vh' : '500px',
        borderRadius: '8px',
      }}
      center={{ lat: center._lat, lng: center._long }}
      zoom={6}
    >
      {state.farms.map((farm, idx) => (
        <Marker
          key={idx}
          position={{ lat: farm.geolocation._lat, lng: farm.geolocation._long }}
          title={farm.name}
          onClick={() => setSelectedFarmIndex(idx)}
        />
      ))}

      {selectedFarmIndex !== null && state.farms[selectedFarmIndex] && (
        <MakerInfo
          farm={state.farms[selectedFarmIndex]}
          onClose={() => setSelectedFarmIndex(null)}
        />
      )}
    </GoogleMap>
  );
}

export default Map;

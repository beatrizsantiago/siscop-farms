import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Box, CircularProgress, Typography } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

const GoogleMapsWrapper = ({ children }: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" padding={4}>
        <CircularProgress size={20} />
        <Typography marginLeft={1} fontWeight={600}>
          Carregando mapa, por favor aguarde...
        </Typography>
      </Box>
    )

  }

  return <>{children}</>;
};

export default GoogleMapsWrapper;

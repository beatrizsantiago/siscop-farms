import { Box, Typography } from '@mui/material';
import { InfoWindow } from '@react-google-maps/api';
import Farm from '@domain/entities/Farm';
import Delete from '@App/Delete';
import Update from '@App/Update';

type Props = {
  farm: Farm,
  onClose: () => void,
}

const MakerInfo = ({ farm, onClose }: Props) => (
  <InfoWindow
    position={{ lat: farm.geolocation._lat, lng: farm.geolocation._long }}
    onCloseClick={onClose}
  >
    <Box padding={1}>
      <Typography fontWeight="bold" align="center">
        {farm.name}
      </Typography>
      <Box display="flex" alignItems="center" marginTop={1} gap={1}>
        <Delete farm={farm} closeMakerInfo={onClose} />
        <Update farm={farm} />
      </Box>
    </Box>
  </InfoWindow>
);

export default MakerInfo;

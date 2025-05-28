import { useState } from 'react';
import {
  Box, Button, Dialog, Typography,
} from '@mui/material';
import Farm from '@domain/entities/Farm';

import Form from './components/Form';

type Props = {
  farm: Farm,
};

const Update = ({ farm }:Props) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => setShowDialog(false);

  return (
    <Box>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outlined"
        color="secondary"
      >
        Editar
      </Button>

      {showDialog && (
        <Dialog
          open
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <Typography variant="h6" fontWeight={600} marginBottom={2}>
            Atualizar
            {' '}
            <strong>{farm.name}</strong>
          </Typography>

          <Form farm={farm} handleClose={handleClose} />
        </Dialog>
      )}
    </Box>
  );
}

export default Update;

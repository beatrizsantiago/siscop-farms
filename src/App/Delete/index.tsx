import { useState } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useFarmContext } from '@App/context';
import { firebaseFarm } from '@fb/farm';
import DeleteFarmUseCase from '@usecases/farms/deleteFarm';
import Farm from '@domain/entities/Farm';

type Props = {
  farm: Farm,
  closeMakerInfo: () => void,
};

const Delete = ({ farm, closeMakerInfo }:Props) => {
  const { dispatch } = useFarmContext();
  
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const toggleDialog = () => setShowConfirmationDialog((current) => !current);

  const onDeleteClick = async () => {
    try {
      const deleteUseCase = new DeleteFarmUseCase(firebaseFarm);
      await deleteUseCase.execute(farm.id);

      toast.success('Fazenda excluída com sucesso!');

      dispatch({
        type: 'DELETE_FARM', id: farm.id,
      });
      closeMakerInfo();
      toggleDialog();
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('REFERENCE_ERROR')) {
        toast.error('A fazenda não pode ser excluída porque está referenciada em outros registros.');
        return;
      }
      toast.error('Erro ao excluir a fazenda. Tente novamente.');
    }
  };

  return (
    <>
      <Button onClick={toggleDialog} variant="outlined" color="error">
         Excluir
      </Button>

      {showConfirmationDialog && (
        <Dialog
          open
          onClose={toggleDialog}
          maxWidth="xs"
          fullWidth
        >
          <Typography variant="h6" fontWeight={600} lineHeight={1.2} align="center">
            Tem certeza que deseja excluir a fazenda
            {' '}
            <strong>
              {farm.name}
            </strong>
            ?
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={3} gap={3}>
            <Button
              onClick={toggleDialog}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onDeleteClick}
              fullWidth
            >
              Excluir
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
}

export default Delete;

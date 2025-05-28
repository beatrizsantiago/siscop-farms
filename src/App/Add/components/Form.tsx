import { useCallback, useState } from 'react';
import {
  Box, Button, TextField, Typography, Grid,
  CircularProgress, FormControl, InputLabel,
  Select, MenuItem, Checkbox, ListItemText,
  OutlinedInput,
} from '@mui/material';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Errors } from '@generalTypes/global';
import { useFarmContext } from '@App/context';
import { firebaseFarm } from '@fb/farm';
import AddFarmUseCase from '@usecases/farms/addFarm';
import ErrorLabel from '@components/ErrorLabel';
import useGetProducts from '@hooks/useGetProducts';
import { toast } from 'react-toastify';

const DEFAULT_CENTER = {
  lat: -23.55052,
  lng: -46.633308
};

type Props = {
  handleClose: () => void;
}

const FormContainer = ({ handleClose }:Props) => {
  const { dispatch } = useFarmContext();

  const { products, loading: productsLoading } = useGetProducts();

  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get('name') as string;

    if (selectedProductIds.length === 0) {
      setErrors({ products: 'Selecione pelo menos um produto.' });
      return;
    }

    if (!selectedPosition) {
      setErrors({ geolocation: 'Selecione a localização da fazenda no mapa.' });
      return;
    }
    
    setErrors(null);
    setLoading(true);

    try {
      const addFarmUseCase = new AddFarmUseCase(firebaseFarm);
      const response = await addFarmUseCase.execute({
        name,
        _lat: selectedPosition.lat,
        _long: selectedPosition.lng,
        available_products: selectedProductIds,
      });

      dispatch({
        type: 'ADD_FARM',
        item: response,
      });

      handleClose();
    } catch (error) {
      toast.error('Erro ao adicionar fazenda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  }, []);

  const handleSelectChange = (event: any) => {
    setSelectedProductIds(event.target.value);
  };

  if (productsLoading) return <CircularProgress />;

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <TextField
            name="name"
            label="Nome"
            variant='standard'
            fullWidth
            required
          />
          {errors?.name && <ErrorLabel error={errors.name} />}
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <InputLabel id="product-select-label">Produtos da fazenda</InputLabel>
            <Select
              labelId="product-select-label"
              multiple
              required
              value={selectedProductIds}
              onChange={handleSelectChange}
              input={<OutlinedInput label="Produtos da fazenda" />}
              renderValue={(selected) =>
                products
                  .filter((p) => selected.includes(p.id))
                  .map((p) => p.name)
                  .join(', ')
              }
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  <Checkbox checked={selectedProductIds.includes(product.id)} />
                  <ListItemText primary={product.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {products.length === 0 && (
            <ErrorLabel error="Nenhum produto cadastrado. Cadastre produtos antes de adicionar uma fazenda." />
          )}
          {errors?.products && <ErrorLabel error={errors.products} />}
        </Grid>

        <Grid size={12}>
          <Typography variant="subtitle1" fontWeight={600} marginBottom={1}>
            Clique no mapa para selecionar a localização da fazenda:
          </Typography>

          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '300px',
              borderRadius: '8px',
            }}
            center={selectedPosition || DEFAULT_CENTER}
            zoom={10}
            onClick={handleMapClick}
          >
            {selectedPosition && (
              <Marker
                position={selectedPosition}
                onDragEnd={handleMapClick}
                draggable
              />
            )}
          </GoogleMap>
          {errors?.geolocation && <ErrorLabel error={errors.geolocation} />}
        </Grid>
      </Grid>

      <Box marginTop={4} display="flex" justifyContent="space-between">
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          loadingPosition="start"
        >
          Cadastrar
        </Button>
      </Box>
    </form>
  );
}

export default FormContainer;

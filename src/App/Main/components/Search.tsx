import { useState } from 'react';
import {
  Input, InputAdornment, useTheme,
} from '@mui/material';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useFarmContext } from '@App/context';

const Search = () => {
  const { palette } = useTheme();
  
  const { onSearch } = useFarmContext();

  const [search, setSearch] = useState('');
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout>();

  const onUpdateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    clearTimeout(searchTimer as unknown as number);
    setSearchTimer(setTimeout(() => {
      onSearch(value);
    }, 1000));
  }

  return (
    <Input
      value={search}
      onChange={onUpdateSearch}
      placeholder="Pesquisar fazenda"
      startAdornment={(
        <InputAdornment position="start">
          <MagnifyingGlassIcon
            size={24}
            color={palette.primary.main}
            weight="duotone"
          />
        </InputAdornment>
      )}
    />
  );
}

export default Search;

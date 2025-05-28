import {
  useContext, createContext, useMemo, useReducer,
  useRef, useEffect, useCallback,
} from 'react';
import { toast } from 'react-toastify';
import { firebaseFarm } from '@fb/farm';
import GetAllFarmsUseCase from '@usecases/farms/getAllFarms';
import SearchFarmsUseCase from '@usecases/farms/searchFarmsByName';

import { FarmProviderProps, FarmProviderType, State } from './types';
import reducer from './reducer';

const initialState:State = {
  farms: [],
  loading: true,
};

const Context = createContext({} as FarmProviderType);
const useFarmContext = ():FarmProviderType => useContext(Context);

const FarmProvider = ({ children }: FarmProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getFarms = useCallback(async () => {
    try {
      const getUserCase = new GetAllFarmsUseCase(firebaseFarm);
      const farms = await getUserCase.execute();
      dispatch({
        type: 'SET_FARMS',
        list: farms,
      });
    } catch {
      toast.error('Erro ao carregar as fazendas');
    }
  }, []);

  const onSearch = useCallback(async (searchText: string) => {
    try {
      if (!searchText) {
        getFarms();
        return;
      }

      const searchUserCase = new SearchFarmsUseCase(firebaseFarm);
      const farms = await searchUserCase.execute(searchText);

      dispatch({
        type: 'SET_FARMS',
        list: farms,
      });
    } catch {
      toast.error('Erro ao pesquisar as fazendas');
    }
  }, [getFarms]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getFarms();
    }
  }, [getFarms]);

  const value = useMemo(() => ({
    state,
    dispatch,
    onSearch,
  }), [state, onSearch]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { FarmProvider, useFarmContext };

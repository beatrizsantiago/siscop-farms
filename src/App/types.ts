import Farm from '@domain/entities/Farm';

export type State = {
  farms: Farm[],
  loading: boolean,
};

export type ActionType = { type: 'SET_FARMS', list: Farm[] }
| { type: 'ADD_FARM', item: Farm }
| { type: 'UPDATE_FARM', item: Farm }
| { type: 'DELETE_FARM', id: string };

export type FarmProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
  onSearch: (searchText: string) => Promise<void>,
};

export type FarmProviderProps = {
  children: React.ReactNode,
};

import { State, ActionType } from './types';

const reducer = (state: State, action: ActionType):State => {
  switch (action.type) {
    case 'SET_FARMS':
      return {
        ...state,
        farms: action.list,
        loading: false,
      };
      
    case 'ADD_FARM':
      return {
        ...state,
        farms: [...state.farms, action.item],
      };

    case 'UPDATE_FARM':
      return {
        ...state,
        farms: state.farms.map((farm) =>
          farm.id === action.item.id ? action.item : farm
        ),
      };

    case 'DELETE_FARM':
      return {
        ...state,
        farms: state.farms.filter((farm) => farm.id !== action.id),
      };

    default:
      throw new Error('Unhandled action');
  }
};

export default reducer;

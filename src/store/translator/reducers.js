import { initialState } from './states';

export const translator = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TRANSLATORS_SUCCESS': {
      return Object.assign({}, state, {
        translators: action.data,
        filters: action.filters
      });
    }
    default:
      return state;
  }
};

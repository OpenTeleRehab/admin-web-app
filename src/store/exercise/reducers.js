import { initialState } from './states';

export const exercise = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_EXERCISES_SUCCESS': {
      return Object.assign({}, state, {
        exercises: action.data,
        filters: action.filters
      });
    }
    case 'GET_EXERCISE_SUCCESS': {
      return Object.assign({}, state, {
        exercise: action.data
      });
    }
    default:
      return state;
  }
};
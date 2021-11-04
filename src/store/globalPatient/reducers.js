import { initialState } from './states';

export const patient = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PATIENT_SUCCESS': {
      return Object.assign({}, state, {
        patients: action.data
      });
    }
    default:
      return state;
  }
};

import { initialState } from './states';

export const assistiveTechnology = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ASSISTIVE_TECHNOLOGIES_SUCCESS': {
      return Object.assign({}, state, {
        assistiveTechnologies: action.data
      });
    }
    case 'GET_ASSISTIVE_TECHNOLOGY_SUCCESS': {
      return Object.assign({}, state, {
        assistiveTechnology: action.data
      });
    }
    case 'GET_ASSISTIVE_TECHNOLOGY_PATIENTS_SUCCESS': {
      return Object.assign({}, state, {
        assistiveTechnologyPatients: action.data
      });
    }
    default:
      return state;
  }
};

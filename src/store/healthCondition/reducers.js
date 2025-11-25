import { initialState } from './states';

export const healthCondition = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_HEALTH_CONDITION_REQUEST':
    case 'UPDATE_HEALTH_CONDITION_REQUEST':
    case 'GET_HEALTH_CONDITIONS_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'CREATE_HEALTH_CONDITION_SUCCESS':
    case 'CREATE_HEALTH_CONDITION_FAIL':
    case 'UPDATE_HEALTH_CONDITION_SUCCESS':
    case 'UPDATE_HEALTH_CONDITION_FAIL':
    case 'GET_HEALTH_CONDITIONS_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    case 'GET_HEALTH_CONDITIONS_SUCCESS': {
      return Object.assign({}, state, {
        healthConditions: action.data
      });
    }
    case 'GET_HEALTH_CONDITION_SUCCESS': {
      return Object.assign({}, state, {
        healthCondition: action.data
      });
    }
    default:
      return state;
  }
};

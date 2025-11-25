import { initialState } from './states';

export const healthConditionGroup = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_HEALTH_CONDITION_GROUP_REQUEST':
    case 'UPDATE_HEALTH_CONDITION_GROUP_REQUEST':
    case 'GET_HEALTH_CONDITION_GROUPS_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'CREATE_HEALTH_CONDITION_GROUP_SUCCESS':
    case 'CREATE_HEALTH_CONDITION_GROUP_FAIL':
    case 'UPDATE_HEALTH_CONDITION_GROUP_SUCCESS':
    case 'UPDATE_HEALTH_CONDITION_GROUP_FAIL':
    case 'GET_HEALTH_CONDITION_GROUPS_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    case 'GET_HEALTH_CONDITION_GROUPS_SUCCESS': {
      return Object.assign({}, state, {
        healthConditionGroups: action.data
      });
    }
    case 'GET_HEALTH_CONDITION_GROUP_SUCCESS': {
      return Object.assign({}, state, {
        healthConditionGroup: action.data
      });
    }
    default:
      return state;
  }
};

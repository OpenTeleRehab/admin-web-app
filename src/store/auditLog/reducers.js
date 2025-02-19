import { initialState } from './states';

export const auditLog = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_AUDIT_LOGS_SUCCESS': {
      return Object.assign({}, state, {
        auditLogs: action.data,
        filters: action.filters
      });
    }
    default:
      return state;
  }
};

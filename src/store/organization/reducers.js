import { initialState } from './states';

export const organization = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORGANIZATION_REQUEST': {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case 'GET_ORGANIZATIONS_SUCCESS': {
      return Object.assign({}, state, {
        organizations: action.data,
        loading: false
      });
    }
    case 'GET_ORGANIZATIONS_FAIL': {
      return Object.assign({}, state, {
        loading: false
      });
    }
    case 'GET_ORGANIZATION_SUCCESS': {
      return Object.assign({}, state, {
        organization: action.data
      });
    }
    case 'GET_ORGANIZATION_THERAPIST_AND_TREATMENT_LIMIT_SUCCESS': {
      return Object.assign({}, state, {
        orgTherapistLimit: action.data ? action.data.max_therapist : 0,
        orgOngoingTreatmentLimit: action.data ? action.data.max_ongoing_treatment_plan : 0
      });
    }
    default:
      return state;
  }
};

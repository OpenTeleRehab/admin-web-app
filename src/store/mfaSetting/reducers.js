import { initialState } from './states';

export const mfaSetting = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MFA_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        mfaSettings: action.data,
        loading: false
      });
    case 'GET_MFA_ENFORCEMENT_VALIDATION_SUCCESS':
      return Object.assign({}, state, {
        mfaEnforcementValidation: action.data,
        loading: false
      });
    case 'CLEAR_MFA_ENFORCEMENT_VALIDATION':
      return Object.assign({}, state, {
        mfaEnforcementValidation: null,
        loading: false
      });
    default:
      return state;
  }
};

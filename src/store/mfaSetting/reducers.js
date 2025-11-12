import { initialState } from './states';

export const mfaSetting = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MFA_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        mfaSettings: action.data,
        loading: false
      });
    case 'GET_USER_MFA_ATTRIBUTES_SUCCESS':
      return Object.assign({}, state, {
        mfaUserResources: action.data,
        loading: false
      });
    default:
      return state;
  }
};

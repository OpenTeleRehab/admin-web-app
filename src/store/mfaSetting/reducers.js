import { initialState } from './states';

export const mfaSetting = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MFA_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        mfaSettings: action.data,
        loading: false
      });
    default:
      return state;
  }
};

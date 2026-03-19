import { initialState } from './states';
import { JOB_STATUS } from 'variables/jobStatus';

export const mfaSetting = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MFA_SETTINGS':
      return Object.assign({}, state, {
        ...state,
        mfaSettings: state.mfaSettings.map((mfa) =>
          mfa.id === action.data.rowId
            ? { ...mfa, progress_status: action.data.status }
            : mfa
        ).filter((mfa) => !action.data.isDeleted || mfa.id !== action.data.rowId)
      });
    case 'GET_MFA_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        mfaSettings: action.data.map((mfa) => ({
          ...mfa,
          progress_status: mfa.job_status?.status || JOB_STATUS.RUNNING
        })),
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

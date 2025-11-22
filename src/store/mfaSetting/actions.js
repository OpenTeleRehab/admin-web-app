import { mutation } from './mutations';

import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';

import {
  showSpinner
} from 'store/spinnerOverlay/actions';
import { MfaSetting } from 'services/mfaSetting';

// Actions
export const getMfaSettings = (payload) => async (dispatch) => {
  dispatch(showSpinner(true));
  const res = await MfaSetting.getMfaSettings(payload);
  if (res.success) {
    dispatch(mutation.getMfaSettingsSuccess(res.data));
    dispatch(showSpinner(false));
    return res.info;
  } else {
    dispatch(showSpinner(false));
    if (res.message) {
      dispatch(showErrorNotification('toast_title.error_message', res.message));
    }
  }
};

export const createMfaSetting = (payload) => async (dispatch) => {
  dispatch(showSpinner(true));
  const res = await MfaSetting.createMfaSetting(payload);
  if (res.success) {
    dispatch(showSpinner(false));
    dispatch(getMfaSettings());
    dispatch(showSuccessNotification('toast_title.edit_mfa_setting', res.message));
    return res.data;
  } else {
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.edit_mfa_setting', res.message));
    return false;
  }
};

export const updateMfaSetting = (id, payload) => async (dispatch) => {
  dispatch(showSpinner(true));
  const res = await MfaSetting.updateMfaSetting(id, payload);
  if (res.success) {
    dispatch(showSpinner(false));
    dispatch(getMfaSettings());
    dispatch(showSuccessNotification('toast_title.edit_mfa_setting', res.message));
    return res.data;
  } else {
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.edit_mfa_setting', res.message));
    return false;
  }
};

export const getMfaEnforcementValidation = (role) => async (dispatch) => {
  const res = await MfaSetting.getMfaEnforcementValidation(role);
  if (res.success) {
    dispatch(mutation.getMfaEnforcementValidationSuccess(res.data));
    return res.data;
  } else {
    if (res.message) {
      dispatch(showErrorNotification('toast_title.error_message', res.message));
    }
  }
};

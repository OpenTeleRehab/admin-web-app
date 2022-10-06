import { privacyPolicy } from 'services/privacyPolicy';
import { privacyPolicyAuth } from 'services/privacyPolicyAuth';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import {
  showSpinner
} from 'store/spinnerOverlay/actions';

export const getPrivacyPolicies = () => async dispatch => {
  dispatch(mutation.getPrivacyPoliciesRequest());
  const data = await privacyPolicy.getPrivacyPolicies();
  if (data.success) {
    dispatch(mutation.getPrivacyPoliciesSuccess(data.data));
  } else {
    dispatch(mutation.getPrivacyPoliciesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getPrivacyPolicy = (id, language) => async dispatch => {
  dispatch(mutation.getPrivacyPolicyRequest());
  const res = await privacyPolicy.getPrivacyPolicy(id, language);
  if (res) {
    dispatch(mutation.getPrivacyPolicySuccess(res.data));
  } else {
    dispatch(mutation.getPrivacyPolicyFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
  }
};

// Actions
export const createPrivacyPolicy = payload => async (dispatch) => {
  dispatch(mutation.createPrivacyPolicyRequest());
  dispatch(showSpinner(true));
  const data = await privacyPolicyAuth.createPrivacyPolicy(payload);
  if (data.success) {
    dispatch(mutation.createPrivacyPolicySuccess());
    dispatch(getPrivacyPolicies());
    dispatch(showSuccessNotification('toast_title.new_privacy_policy', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createPrivacyPolicyFail());
    dispatch(showErrorNotification('toast_title.new_privacy_policy', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updatePrivacyPolicy = (id, payload) => async (dispatch) => {
  dispatch(mutation.updatePrivacyPolicyRequest());
  const data = await privacyPolicyAuth.updatePrivacyPolicy(id, payload);
  if (data.success) {
    dispatch(mutation.updatePrivacyPolicySuccess());
    dispatch(getPrivacyPolicies());
    dispatch(showSuccessNotification('toast_title.edit_privacy_policy', data.message));
    return true;
  } else {
    dispatch(mutation.updatePrivacyPolicyFail());
    dispatch(showErrorNotification('toast_title.edit_privacy_policy', data.message));
    return false;
  }
};

export const publishPrivacyPolicy = id => async (dispatch) => {
  const data = await privacyPolicyAuth.publishPrivacyPolicy(id);
  if (data.success) {
    dispatch(getPrivacyPolicies());
    dispatch(showSuccessNotification('toast_title.publish_privacy_policy', data.message));
    return true;
  } else {
    dispatch(mutation.updatePrivacyPolicyFail());
    dispatch(showErrorNotification('toast_title.publish_privacy_policy', data.message));
    return false;
  }
};

export const getPublishPrivacyPolicy = payload => async dispatch => {
  dispatch(mutation.getPublishPrivacyPolicyRequest());
  const res = await privacyPolicy.getPublishPrivacyPolicy(payload);
  if (res) {
    dispatch(mutation.getPublishPrivacyPolicySuccess(res.data));
  } else {
    dispatch(mutation.getPublishPrivacyPolicyFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
  }
};

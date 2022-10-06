import { termAndCondition } from 'services/termAndCondition';
import { termAndConditionAuth } from 'services/termAndConditionAuth';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import {
  showSpinner
} from 'store/spinnerOverlay/actions';

export const getTermAndConditions = () => async dispatch => {
  dispatch(mutation.getTermAndConditionsRequest());
  const data = await termAndCondition.getTermAndConditions();
  if (data.success) {
    dispatch(mutation.getTermAndConditionsSuccess(data.data));
  } else {
    dispatch(mutation.getTermAndConditionsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getTermAndCondition = (id, language) => async (dispatch) => {
  dispatch(mutation.getTermAndConditionRequest());
  const res = await termAndCondition.getTermAndCondition(id, language);
  if (res) {
    dispatch(mutation.getTermAndConditionSuccess(res.data));
  } else {
    dispatch(mutation.getTermAndConditionFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
  }
};

// Actions
export const createTermAndCondition = payload => async (dispatch) => {
  dispatch(mutation.createTermAndConditionRequest());
  dispatch(showSpinner(true));
  const data = await termAndConditionAuth.createTermAndCondition(payload);
  if (data.success) {
    dispatch(mutation.createTermAndConditionSuccess());
    dispatch(getTermAndConditions());
    dispatch(showSuccessNotification('toast_title.new_term_and_condition', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createTermAndConditionFail());
    dispatch(showErrorNotification('toast_title.new_term_and_condition', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateTermAndCondition = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateTermAndConditionRequest());
  const data = await termAndConditionAuth.updateTermAndCondition(id, payload);
  if (data.success) {
    dispatch(mutation.updateTermAndConditionSuccess());
    dispatch(getTermAndConditions());
    dispatch(showSuccessNotification('toast_title.edit_term_and_condition', data.message));
    return true;
  } else {
    dispatch(mutation.updateTermAndConditionFail());
    dispatch(showErrorNotification('toast_title.edit_term_and_condition', data.message));
    return false;
  }
};

export const publishTermAndCondition = id => async (dispatch) => {
  const data = await termAndConditionAuth.publishTermAndCondition(id);
  if (data.success) {
    dispatch(getTermAndConditions());
    dispatch(showSuccessNotification('toast_title.publish_term_and_condition', data.message));
    return true;
  } else {
    dispatch(mutation.updateTermAndConditionFail());
    dispatch(showErrorNotification('toast_title.publish_term_and_condition', data.message));
    return false;
  }
};

export const getPublishTermCondition = payload => async dispatch => {
  dispatch(mutation.getPublishTermConditionRequest());
  dispatch(showSpinner(true));
  const data = await termAndCondition.getPublishTermConditionPage(payload);
  if (data) {
    dispatch(mutation.getPublishTermConditionSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getPublishTermConditionFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

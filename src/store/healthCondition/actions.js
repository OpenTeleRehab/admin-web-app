import { HealthCondition } from 'services/healthCondition';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getHealthConditions = payload => async dispatch => {
  dispatch(mutation.getHealthConditionsRequest());
  const data = await HealthCondition.getHealthConditions(payload);
  if (data.success) {
    dispatch(mutation.getHealthConditionsSuccess(data.data));
  } else {
    dispatch(mutation.getHealthConditionsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getHealthCondition = (id, language) => async dispatch => {
  dispatch(mutation.getHealthConditionRequest());
  dispatch(showSpinner(true));
  const data = await HealthCondition.getHealthCondition(id, language);
  if (data) {
    dispatch(mutation.getHealthConditionSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getHealthConditionFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createHealthCondition = payload => async (dispatch) => {
  dispatch(mutation.createHealthConditionRequest());
  dispatch(showSpinner(true));
  const data = await HealthCondition.createHealthCondition(payload);
  if (data.success) {
    dispatch(mutation.createHealthConditionSuccess());
    dispatch(getHealthConditions({ parent_id: payload.health_condition_group }));
    dispatch(showSuccessNotification('toast_title.new_health_condition', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createHealthConditionFail());
    dispatch(showErrorNotification('toast_title.new_health_condition', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateHealthCondition = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateHealthConditionRequest());
  const data = await HealthCondition.updateHealthCondition(id, payload);
  if (data.success) {
    dispatch(mutation.updateHealthConditionSuccess());
    dispatch(getHealthConditions({ parent_id: payload.health_condition_group }));
    dispatch(showSuccessNotification('toast_title.edit_health_condition', data.message));
    return true;
  } else {
    dispatch(mutation.updateHealthConditionFail());
    dispatch(showErrorNotification('toast_title.edit_health_condition', data.message));
    return false;
  }
};

export const deleteHealthCondition = (id, parent) => async (dispatch) => {
  dispatch(mutation.deleteHealthConditionRequest());
  const data = await HealthCondition.deleteHealthCondition(id);
  if (data.success) {
    dispatch(mutation.deleteHealthConditionSuccess());
    dispatch(getHealthConditions({ parent_id: parent }));
    dispatch(showSuccessNotification('toast_title.delete_health_condition', data.message));
    return true;
  } else {
    dispatch(mutation.deleteHealthConditionFail());
    dispatch(showErrorNotification('toast_title.delete_health_condition', data.message));
    return false;
  }
};

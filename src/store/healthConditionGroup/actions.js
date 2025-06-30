import { HealthConditionGroup } from 'services/healthConditionGroup';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getHealthConditionGroups = () => async dispatch => {
  dispatch(mutation.getHealthConditionGroupsRequest());
  const data = await HealthConditionGroup.getHealthConditionGroups();
  if (data.success) {
    dispatch(mutation.getHealthConditionGroupsSuccess(data.data));
  } else {
    dispatch(mutation.getHealthConditionGroupsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getHealthConditionGroup = (id, language) => async dispatch => {
  dispatch(mutation.getHealthConditionGroupRequest());
  dispatch(showSpinner(true));
  const data = await HealthConditionGroup.getHealthConditionGroup(id, language);
  if (data) {
    dispatch(mutation.getHealthConditionGroupSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getHealthConditionGroupFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createHealthConditionGroup = payload => async (dispatch) => {
  dispatch(mutation.createHealthConditionGroupRequest());
  dispatch(showSpinner(true));
  const data = await HealthConditionGroup.createHealthConditionGroup(payload);
  if (data.success) {
    dispatch(mutation.createHealthConditionGroupSuccess());
    dispatch(getHealthConditionGroups());
    dispatch(showSuccessNotification('toast_title.new_health_condition_group', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createHealthConditionGroupFail());
    dispatch(showErrorNotification('toast_title.new_health_condition_group', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateHealthConditionGroup = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateHealthConditionGroupRequest());
  const data = await HealthConditionGroup.updateHealthConditionGroup(id, payload);
  if (data.success) {
    dispatch(mutation.updateHealthConditionGroupSuccess());
    dispatch(getHealthConditionGroups());
    dispatch(showSuccessNotification('toast_title.edit_health_condition_group', data.message));
    return true;
  } else {
    dispatch(mutation.updateHealthConditionGroupFail());
    dispatch(showErrorNotification('toast_title.edit_health_condition_group', data.message));
    return false;
  }
};

export const deleteHealthConditionGroup = (id) => async (dispatch) => {
  dispatch(mutation.deleteHealthConditionGroupRequest());
  const data = await HealthConditionGroup.deleteHealthConditionGroup(id);
  if (data.success) {
    dispatch(mutation.deleteHealthConditionGroupSuccess());
    dispatch(getHealthConditionGroups());
    dispatch(showSuccessNotification('toast_title.delete_health_condition_group', data.message));
    return true;
  } else {
    dispatch(mutation.deleteHealthConditionGroupFail());
    dispatch(showErrorNotification('toast_title.delete_health_condition_group', data.message));
    return false;
  }
};

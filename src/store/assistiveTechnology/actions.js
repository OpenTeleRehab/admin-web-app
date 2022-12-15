import { AssistiveTechnology } from 'services/assistiveTechnology';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getAssistiveTechnologies = payload => async dispatch => {
  dispatch(mutation.getAssistiveTechnologiesRequest());
  const data = await AssistiveTechnology.getAssistiveTechnologies(payload);
  if (data.success) {
    dispatch(mutation.getAssistiveTechnologiesSuccess(data.data));
  } else {
    dispatch(mutation.getAssistiveTechnologiesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getAssistiveTechnology = (id, language) => async (dispatch) => {
  dispatch(mutation.getAssistiveTechnologyRequest());
  dispatch(showSpinner(true));
  const data = await AssistiveTechnology.getAssistiveTechnology(id, language);
  if (data) {
    dispatch(mutation.getAssistiveTechnologySuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getAssistiveTechnologyFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createAssistiveTechnology = payload => async (dispatch) => {
  dispatch(mutation.createAssistiveTechnologyRequest());
  dispatch(showSpinner(true));
  const data = await AssistiveTechnology.createAssistiveTechnology(payload);
  if (data.success) {
    dispatch(mutation.createAssistiveTechnologySuccess());
    dispatch(getAssistiveTechnologies());
    dispatch(showSuccessNotification('toast_title.new_assistive_technology', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.getAssistiveTechnologyFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateAssistiveTechnology = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateAssistiveTechnologySuccess());
  const data = await AssistiveTechnology.updateAssistiveTechnology(id, payload);
  if (data.success) {
    dispatch(mutation.updateAssistiveTechnologySuccess());
    dispatch(getAssistiveTechnologies());
    dispatch(showSuccessNotification('toast_title.edit_assistive_technology', data.message));
    return true;
  } else {
    dispatch(mutation.updateAssistiveTechnologyFail());
    dispatch(showErrorNotification('toast_title.edit_assistive_technology', data.message));
    return false;
  }
};

export const deleteAssistiveTechnology = id => async (dispatch) => {
  dispatch(mutation.deleteAssistiveTechnologyRequest());
  const data = await AssistiveTechnology.deleteAssistiveTechnology(id);
  if (data.success) {
    dispatch(mutation.deleteAssistiveTechnologySuccess());
    dispatch(getAssistiveTechnologies());
    dispatch(showSuccessNotification('toast_title.delete_assistive_technology', data.message));
    return true;
  } else {
    dispatch(mutation.deleteAssistiveTechnologyFail());
    dispatch(showErrorNotification('toast_title.delete_assistive_technology', data.message));
    return false;
  }
};

export const getAssistiveTechnologyPatients = payload => async dispatch => {
  dispatch(mutation.getAssistiveTechnologyPatientsRequest());
  const data = await AssistiveTechnology.getAssistiveTechnologyPatients(payload);
  if (data.success) {
    dispatch(mutation.getAssistiveTechnologyPatientsSuccess(data.data));
    return data.info;
  } else {
    dispatch(mutation.getAssistiveTechnologyPatientsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

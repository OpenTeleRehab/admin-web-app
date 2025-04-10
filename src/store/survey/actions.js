import { saveAs } from 'file-saver';
import { Survey } from 'services/survey';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getSurveys = payload => async dispatch => {
  dispatch(mutation.getSurveysRequest());
  const data = await Survey.getSurveys(payload);
  if (data.success) {
    dispatch(mutation.getSurveysSuccess(data.data));
  } else {
    dispatch(mutation.getSurveysFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getSurvey = (id) => async (dispatch) => {
  dispatch(mutation.getSurveyRequest());
  dispatch(showSpinner(true));
  const data = await Survey.getSurvey(id);
  if (data) {
    dispatch(mutation.getSurveySuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getSurveyFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createSurvey = payload => async (dispatch) => {
  dispatch(mutation.createSurveyRequest());
  dispatch(showSpinner(true));
  const data = await Survey.createSurvey(payload);
  if (data.success) {
    dispatch(mutation.createSurveySuccess());
    dispatch(getSurveys());
    dispatch(showSuccessNotification('toast_title.new_survey', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createSurveyFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateSurvey = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateSurveyRequest());
  const data = await Survey.updateSurvey(id, payload);
  if (data.success) {
    dispatch(mutation.updateSurveySuccess());
    dispatch(getSurveys());
    dispatch(showSuccessNotification('toast_title.edit_survey', data.message));
    return true;
  } else {
    dispatch(mutation.updateSurveyFail());
    dispatch(showErrorNotification('toast_title.edit_survey', data.message));
    return false;
  }
};

export const publishSurvey = id => async (dispatch) => {
  dispatch(mutation.publishSurveyRequest());
  const data = await Survey.publishSurvey(id);
  if (data.success) {
    dispatch(getSurveys());
    dispatch(showSuccessNotification('toast_title.publish_survey', data.message));
    return true;
  } else {
    dispatch(mutation.publishSurveyFail());
    dispatch(showErrorNotification('toast_title.publish_survey', data.message));
    return false;
  }
};

export const getPublishSurvey = (payload) => async (dispatch) => {
  dispatch(mutation.getPublishSurveyRequest());
  dispatch(showSpinner(true));
  const data = await Survey.getPublishSurvey(payload);
  if (data) {
    dispatch(mutation.getPublishSurveySuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getPublishSurveyFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const submitSurvey = payload => async (dispatch) => {
  dispatch(mutation.submitSurveyRequest());
  const data = await Survey.submitSurvey(payload);
  if (data.success) {
    dispatch(showSuccessNotification('toast_title.submit_survey', data.message));
    return true;
  } else {
    dispatch(mutation.submitSurveyFail());
    dispatch(showErrorNotification('toast_title.submit_survey', data.message));
    return false;
  }
};

export const skipSurvey = payload => async (dispatch) => {
  dispatch(mutation.skipSurveyRequest());
  const data = await Survey.skipSurvey(payload);
  if (data.success) {
    dispatch(showSuccessNotification('toast_title.skip_survey', data.message));
    return true;
  } else {
    dispatch(mutation.skipSurveyFail());
    dispatch(showErrorNotification('toast_title.skip_survey', data.message));
    return false;
  }
};

export const exportSurvey = payload => async dispatch => {
  dispatch(mutation.exportSurveyRequest());
  const res = await Survey.exportSurvey(payload);
  if (res) {
    dispatch(mutation.exportSurveySuccess());
    saveAs(res, 'Survey_Result_' + Date.now() + '.xlsx');
    return true;
  } else {
    dispatch(mutation.exportSurveyFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
    return false;
  }
};

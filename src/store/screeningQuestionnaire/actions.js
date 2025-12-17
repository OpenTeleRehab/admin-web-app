import { mutation } from './mutations';
import { ScreeningQuestionnaire } from '../../services/screeningQuestionnaire';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getScreeningQuestionnaires = (payload) => async dispatch => {
  dispatch(mutation.getScreeningQuestionnairesRequest());
  const data = await ScreeningQuestionnaire.getScreeningQuestionnaires(payload);
  if (data.success) {
    dispatch(mutation.getScreeningQuestionnairesSuccess(data.data));
  } else {
    dispatch(mutation.getScreeningQuestionnairesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getScreeningQuestionnaire = (id) => async (dispatch) => {
  dispatch(mutation.getScreeningQuestionnaireRequest());
  dispatch(showSpinner(true));
  const data = await ScreeningQuestionnaire.getScreeningQuestionnaire(id);
  if (data) {
    dispatch(mutation.getScreeningQuestionnaireSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getScreeningQuestionnaireFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createScreeningQuestionnaire = (payload) => async (dispatch) => {
  dispatch(mutation.createScreeningQuestionnaireRequest());
  dispatch(showSpinner(true));
  const data = await ScreeningQuestionnaire.createScreeningQuestionnaire(payload);
  if (data.success) {
    dispatch(mutation.createScreeningQuestionnaireSuccess());
    dispatch(getScreeningQuestionnaires());
    dispatch(showSuccessNotification('toast_title.new_survey', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createScreeningQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateScreeningQuestionnaire = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateScreeningQuestionnaireRequest());
  const data = await ScreeningQuestionnaire.updateScreeningQuestionnaire(id, payload);
  if (data.success) {
    dispatch(mutation.updateScreeningQuestionnaireSuccess());
    dispatch(getScreeningQuestionnaires());
    dispatch(showSuccessNotification('toast_title.edit_screening_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.updateScreeningQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.edit_screening_questionnaire', data.message));
    return false;
  }
};

export const publishScreeningQuestionnaire = (id) => async (dispatch) => {
  dispatch(mutation.publishScreeningQuestionnaireRequest());
  const data = await ScreeningQuestionnaire.publishScreeningQuestionnaire(id);
  if (data.success) {
    dispatch(getScreeningQuestionnaires());
    dispatch(showSuccessNotification('toast_title.publish_screening_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.publishScreeningQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.publish_screening_questionnaire', data.message));
    return false;
  }
};

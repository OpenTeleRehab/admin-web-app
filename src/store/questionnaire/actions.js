import { Questionnaire } from 'services/questionnaire';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getQuestionnaires = payload => async dispatch => {
  dispatch(mutation.getQuestionnairesRequest());
  dispatch(showSpinner(true));
  const data = await Questionnaire.getQuestionnaires(payload);
  if (data.success) {
    dispatch(mutation.getQuestionnairesSuccess(data.data, payload));
    dispatch(showSpinner(false));
    return data.info;
  } else {
    dispatch(mutation.getQuestionnairesFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getQuestionnaire = (id, language) => async dispatch => {
  dispatch(mutation.getQuestionnaireRequest());
  dispatch(showSpinner(true));
  const data = await Questionnaire.getQuestionnaire(id, language);
  if (data) {
    dispatch(mutation.getQuestionnaireSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getQuestionnaireFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createQuestionnaire = (payload) => async dispatch => {
  dispatch(mutation.createQuestionnaireRequest());
  const data = await Questionnaire.createQuestionnaire(payload);
  if (data.success) {
    dispatch(mutation.createQuestionnaireSuccess());
    dispatch(showSuccessNotification('toast_title.new_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.createQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.new_questionnaire', data.message));
    return false;
  }
};

export const updateQuestionnaire = (id, payload) => async dispatch => {
  dispatch(mutation.updateQuestionnaireRequest());
  const data = await Questionnaire.updateQuestionnaire(id, payload);
  if (data.success) {
    dispatch(mutation.updateQuestionnaireSuccess());
    dispatch(showSuccessNotification('toast_title.update_questionnaire', data.message));
    return true;
  } else {
    dispatch(mutation.updateQuestionnaireFail());
    dispatch(showErrorNotification('toast_title.update_questionnaire', data.message));
    return false;
  }
};

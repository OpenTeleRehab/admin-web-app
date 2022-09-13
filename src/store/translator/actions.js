import { Translator } from 'services/translator';
import { mutation } from './mutations';

import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';

import {
  showSpinner
} from 'store/spinnerOverlay/actions';

// Actions
export const createTranslator = payload => async (dispatch, getState) => {
  dispatch(mutation.createTranslatorRequest());
  dispatch(showSpinner(true));
  const data = await Translator.createTranslator(payload);
  if (data.success) {
    dispatch(mutation.createTranslatorSuccess());
    const filters = getState().translator.filters;
    dispatch(getTranslators({ ...filters }));
    dispatch(showSuccessNotification('toast_title.new_translator_account', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createTranslatorFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.new_translator_account', data.message));
    return false;
  }
};

export const getTranslators = payload => async dispatch => {
  dispatch(mutation.getTranslatorsRequest());
  dispatch(showSpinner(true));
  const data = await Translator.getTranslators(payload);
  if (data.success) {
    dispatch(mutation.getTranslatorsSuccess(data.data, payload));
    dispatch(showSpinner(false));
    return data.info;
  } else {
    dispatch(mutation.getTranslatorsFail());
    dispatch(showSpinner(false));
    if (data.message) {
      dispatch(showErrorNotification('toast_title.error_message', data.message));
    }
  }
};

export const updateTranslator = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateTranslatorRequest());
  const data = await Translator.updateTranslator(id, payload);
  if (data.success) {
    dispatch(mutation.updateTranslatorSuccess());
    const filters = getState().translator.filters;
    dispatch(getTranslators({ ...filters }));
    dispatch(showSuccessNotification('toast_title.edit_translator_account', data.message));
    return true;
  } else {
    dispatch(mutation.updateTranslatorFail());
    dispatch(showErrorNotification('toast_title.edit_translator_account', data.message));
    return false;
  }
};

export const updateTranslatorStatus = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateTranslatorRequest());
  const data = await Translator.updateTranslatorStatus(id, payload);
  if (data.success) {
    dispatch(mutation.updateTranslatorStatusSuccess());
    const filters = getState().translator.filters;
    dispatch(getTranslators({ ...filters }));
    dispatch(showSuccessNotification('toast_title.edit_translator_account', data.message));
    return true;
  } else {
    dispatch(mutation.updateTranslatorStatusFail());
    dispatch(showErrorNotification('toast_title.edit_translator_account', data.message));
    return false;
  }
};

export const deleteTranslator = (id) => async (dispatch, getState) => {
  dispatch(mutation.deleteTranslatorRequest());
  const data = await Translator.deleteTranslator(id);
  if (data.success) {
    dispatch(mutation.deleteTranslatorSuccess());
    const filters = getState().translator.filters;
    dispatch(getTranslators({ ...filters }));
    dispatch(showSuccessNotification('toast_title.delete_translator_account', data.message));
    return true;
  } else {
    dispatch(mutation.deleteTranslatorFail());
    dispatch(showErrorNotification('toast_title.delete_translator_account', data.message));
    return false;
  }
};

export const resendEmail = (id, type) => async (dispatch, getState) => {
  dispatch(mutation.resendEmailRequest());
  const data = await Translator.resendEmail(id);
  if (data.success) {
    dispatch(mutation.resendEmailSuccess());
    const filters = getState().translator.filters;
    dispatch(getTranslators({ ...filters }));
    dispatch(showSuccessNotification('toast_title.rensend_translator_account', data.message));
    return true;
  } else {
    dispatch(mutation.resendEmailFail());
    dispatch(showErrorNotification('toast_title.rensend_translator_account', data.message));
    return false;
  }
};

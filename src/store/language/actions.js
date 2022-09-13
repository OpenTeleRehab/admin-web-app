import { Language } from 'services/language';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import {
  showSpinner
} from 'store/spinnerOverlay/actions';

export const getLanguages = () => async dispatch => {
  dispatch(mutation.getLanguagesRequest());
  const data = await Language.getLanguage();
  if (data.success) {
    dispatch(mutation.getLanguagesSuccess(data.data));
  } else {
    dispatch(mutation.getLanguagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

// Actions
export const createLanguage = payload => async (dispatch) => {
  dispatch(mutation.createLanguageRequest());
  dispatch(showSpinner(true));
  const data = await Language.createLanguage(payload);
  if (data.success) {
    dispatch(mutation.createLanguageSuccess());
    dispatch((getLanguages()));
    dispatch(showSuccessNotification('toast_title.new_language', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createLanguageFail());
    dispatch(showErrorNotification('toast_title.new_language', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateLanguage = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateLanguageRequest());
  const data = await Language.updateLanguage(id, payload);
  if (data.success) {
    dispatch(mutation.updateLanguageSuccess());
    dispatch(getLanguages());
    dispatch(showSuccessNotification('toast_title.edit_language', data.message));
    return true;
  } else {
    dispatch(mutation.updateLanguageFail());
    dispatch(showErrorNotification('toast_title.edit_language', data.message));
    return false;
  }
};

export const deleteLanguage = id => async (dispatch) => {
  dispatch(mutation.deleteLanguageRequest());
  const data = await Language.deleteLanguage(id);
  if (data.success) {
    dispatch(mutation.deleteLanguageSuccess());
    dispatch(getLanguages());
    dispatch(showSuccessNotification('toast_title.delete_language', data.message));
    return true;
  } else {
    dispatch(mutation.deleteLanguageFail());
    dispatch(showErrorNotification('toast_title.delete_language', data.message));
    return false;
  }
};

export const autoTranslateLanguage = id => async (dispatch) => {
  dispatch(mutation.autoTranslateLanguageRequest());
  const data = await Language.autoTranslateLanguage(id);
  if (data.success) {
    dispatch(mutation.autoTranslateLanguageSuccess());
    dispatch(getLanguages());
    dispatch(showSuccessNotification('toast_title.auto_translate_language', data.message));
    return true;
  } else {
    dispatch(mutation.autoTranslateLanguageFail());
    dispatch(showErrorNotification('toast_title.auto_translate_language', data.message));
    return false;
  }
};

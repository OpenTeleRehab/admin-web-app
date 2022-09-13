const getLanguagesRequest = () => ({
  type: 'GET_LANGUAGES_REQUEST'
});

const getLanguagesSuccess = (data) => ({
  type: 'GET_LANGUAGES_SUCCESS',
  data
});

const getLanguagesFail = () => ({
  type: 'GET_LANGUAGES_FAIL'
});

const createLanguageRequest = () => ({
  type: 'CREATE_LANGUAGE_REQUEST'
});

const createLanguageSuccess = () => ({
  type: 'CREATE_LANGUAGE_SUCCESS'
});

const createLanguageFail = () => ({
  type: 'CREATE_LANGUAGE_FAIL'
});

const updateLanguageRequest = () => ({
  type: 'UPDATE_LANGUAGE_REQUEST'
});

const updateLanguageSuccess = () => ({
  type: 'UPDATE_LANGUAGE_SUCCESS'
});

const updateLanguageFail = () => ({
  type: 'UPDATE_LANGUAGE_FAIL'
});

const deleteLanguageRequest = () => ({
  type: 'DELETE_LANGUAGE_REQUEST'
});

const deleteLanguageSuccess = () => ({
  type: 'DELETE_LANGUAGE_SUCCESS'
});

const deleteLanguageFail = () => ({
  type: 'DELETE_LANGUAGE_FAIL'
});

const autoTranslateLanguageRequest = () => ({
  type: 'AUTO_TRANSLATE_LANGUAGE_REQUEST'
});

const autoTranslateLanguageSuccess = () => ({
  type: 'AUTO_TRANSLATE_LANGUAGE_SUCCESS'
});

const autoTranslateLanguageFail = () => ({
  type: 'AUTO_TRANSLATE_LANGUAGE_FAIL'
});

export const mutation = {
  getLanguagesRequest,
  getLanguagesSuccess,
  getLanguagesFail,
  createLanguageFail,
  createLanguageRequest,
  createLanguageSuccess,
  updateLanguageRequest,
  updateLanguageSuccess,
  updateLanguageFail,
  deleteLanguageRequest,
  deleteLanguageSuccess,
  deleteLanguageFail,
  autoTranslateLanguageRequest,
  autoTranslateLanguageSuccess,
  autoTranslateLanguageFail
};

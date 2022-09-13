const createTranslatorRequest = () => ({
  type: 'CREATE_TRANSLATOR_REQUEST'
});

const createTranslatorSuccess = () => ({
  type: 'CREATE_TRANSLATOR_SUCCESS'
});

const createTranslatorFail = () => ({
  type: 'CREATE_TRANSLATOR_FAIL'
});

const getTranslatorsRequest = () => ({
  type: 'GET_TRANSLATORS_REQUEST'
});

const getTranslatorsSuccess = (data, filters) => ({
  type: 'GET_TRANSLATORS_SUCCESS',
  data,
  filters
});

const getTranslatorsFail = () => ({
  type: 'GET_TRANSLATORS_FAIL'
});

const updateTranslatorRequest = () => ({
  type: 'UPDATE_TRANSLATOR_REQUEST'
});

const updateTranslatorSuccess = () => ({
  type: 'UPDATE_TRANSLATOR_SUCCESS'
});

const updateTranslatorFail = () => ({
  type: 'UPDATE_TRANSLATOR_FAIL'
});

const updateTranslatorStatusRequest = () => ({
  type: 'UPDATE_TRANSLATOR_STATUS_REQUEST'
});

const updateTranslatorStatusSuccess = () => ({
  type: 'UPDATE_TRANSLATOR_STATUS_SUCCESS'
});

const updateTranslatorStatusFail = () => ({
  type: 'UPDATE_TRANSLATOR_STATUS_FAIL'
});

const deleteTranslatorRequest = () => ({
  type: 'DELETE_TRANSLATOR_REQUEST'
});

const deleteTranslatorSuccess = () => ({
  type: 'DELETE_TRANSLATOR_SUCCESS'
});

const deleteTranslatorFail = () => ({
  type: 'DELETE_TRANSLATOR_FAIL'
});

const resendEmailRequest = () => ({
  type: 'RESEND_EMAIL_REQUEST'
});

const resendEmailSuccess = () => ({
  type: 'RESEND_EMAIL_SUCCESS'
});

const resendEmailFail = () => ({
  type: 'RESEND_EMAIL_FAIL'
});

export const mutation = {
  createTranslatorRequest,
  createTranslatorSuccess,
  createTranslatorFail,
  getTranslatorsRequest,
  getTranslatorsSuccess,
  getTranslatorsFail,
  updateTranslatorRequest,
  updateTranslatorSuccess,
  updateTranslatorFail,
  deleteTranslatorRequest,
  deleteTranslatorSuccess,
  deleteTranslatorFail,
  updateTranslatorStatusRequest,
  updateTranslatorStatusSuccess,
  updateTranslatorStatusFail,
  resendEmailSuccess,
  resendEmailRequest,
  resendEmailFail
};

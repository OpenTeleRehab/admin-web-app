const getQuestionnairesRequest = () => ({
  type: 'GET_QUESTIONNAIRES_REQUEST'
});

const getQuestionnairesSuccess = (data, filters) => ({
  type: 'GET_QUESTIONNAIRES_SUCCESS',
  data,
  filters
});

const getQuestionnairesFail = () => ({
  type: 'GET_QUESTIONNAIRES_FAIL'
});

const getQuestionnaireRequest = () => ({
  type: 'GET_QUESTIONNAIRE_REQUEST'
});

const getQuestionnaireSuccess = (data) => ({
  type: 'GET_QUESTIONNAIRE_SUCCESS',
  data
});

const getQuestionnaireFail = () => ({
  type: 'GET_QUESTIONNAIRE_FAIL'
});

const createQuestionnaireRequest = () => ({
  type: 'CREATE_QUESTIONNAIRE_REQUEST'
});

const createQuestionnaireSuccess = () => ({
  type: 'CREATE_QUESTIONNAIRE_SUCCESS'
});

const createQuestionnaireFail = () => ({
  type: 'CREATE_QUESTIONNAIRE_FAIL'
});

const updateQuestionnaireRequest = () => ({
  type: 'UPDATE_QUESTIONNAIRE_REQUEST'
});

const updateQuestionnaireSuccess = () => ({
  type: 'UPDATE_QUESTIONNAIRE_SUCCESS'
});

const updateQuestionnaireFail = () => ({
  type: 'UPDATE_QUESTIONNAIRE_FAIL'
}); ;

const deleteQuestionnaireRequest = () => ({
  type: 'DELETE_QUESTIONNAIRE_REQUEST'
});

const deleteQuestionnaireSuccess = () => ({
  type: 'DELETE_QUESTIONNAIRE_SUCCESS'
});

const deleteQuestionnaireFail = () => ({
  type: 'DELETE_QUESTIONNAIRE_FAIL'
});

const clearFilterQuestionnairesRequest = () => ({
  type: 'CLEAR_FILTER_QUESTIONNAIRES_REQUEST'
});

const approveTranslationRequest = () => ({
  type: 'APPROVE_TRANSLATION_REQUEST'
});

const approveTranslationSuccess = () => ({
  type: 'APPROVE_TRANSLATION_SUCCESS'
});

const approveTranslationFail = () => ({
  type: 'APPROVE_TRANSLATION_FAIL'
});

const rejectTranslationRequest = () => ({
  type: 'REJECT_TRANSLATION_REQUEST'
});

const rejectTranslationSuccess = () => ({
  type: 'REJECT_TRANSLATION_SUCCESS'
});

const rejectTranslationFail = () => ({
  type: 'REJECT_TRANSLATION_FAIL'
});

export const mutation = {
  getQuestionnairesRequest,
  getQuestionnairesSuccess,
  getQuestionnairesFail,
  getQuestionnaireRequest,
  getQuestionnaireSuccess,
  getQuestionnaireFail,
  createQuestionnaireFail,
  createQuestionnaireRequest,
  createQuestionnaireSuccess,
  updateQuestionnaireRequest,
  updateQuestionnaireSuccess,
  updateQuestionnaireFail,
  deleteQuestionnaireRequest,
  deleteQuestionnaireSuccess,
  deleteQuestionnaireFail,
  clearFilterQuestionnairesRequest,
  approveTranslationRequest,
  approveTranslationSuccess,
  approveTranslationFail,
  rejectTranslationRequest,
  rejectTranslationSuccess,
  rejectTranslationFail
};

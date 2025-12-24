const getScreeningQuestionnairesRequest = () => ({
  type: 'GET_SCREENING_QUESTIONNAIRES_REQUEST'
});

const getScreeningQuestionnairesSuccess = (data) => ({
  type: 'GET_SCREENING_QUESTIONNAIRES_SUCCESS',
  data
});

const getScreeningQuestionnairesFail = () => ({
  type: 'GET_SCREENING_QUESTIONNAIRES_FAIL'
});

const getScreeningQuestionnaireRequest = () => ({
  type: 'GET_SCREENING_QUESTIONNAIRE_REQUEST'
});

const getScreeningQuestionnaireSuccess = (data) => ({
  type: 'GET_SCREENING_QUESTIONNAIRE_SUCCESS',
  data
});

const getScreeningQuestionnaireFail = () => ({
  type: 'GET_SCREENING_QUESTIONNAIRE_FAIL'
});

const createScreeningQuestionnaireRequest = () => ({
  type: 'CREATE_SCREENING_QUESTIONNAIRE_REQUEST'
});

const createScreeningQuestionnaireSuccess = () => ({
  type: 'CREATE_SCREENING_QUESTIONNAIRE_SUCCESS'
});

const createScreeningQuestionnaireFail = () => ({
  type: 'CREATE_SCREENING_QUESTIONNAIRE_FAIL'
});

const updateScreeningQuestionnaireRequest = () => ({
  type: 'UPDATE_SCREENING_QUESTIONNAIRE_REQUEST'
});

const updateScreeningQuestionnaireSuccess = () => ({
  type: 'UPDATE_SCREENING_QUESTIONNAIRE_SUCCESS'
});

const updateScreeningQuestionnaireFail = () => ({
  type: 'UPDATE_SCREENING_QUESTIONNAIRE_FAIL'
});

const publishScreeningQuestionnaireRequest = () => ({
  type: 'PUBLISH_SCREENING_QUESTIONNAIRE_REQUEST'
});

const publishScreeningQuestionnaireSuccess = (data) => ({
  type: 'PUBLISH_SCREENING_QUESTIONNAIRE_SUCCESS',
  data
});

const publishScreeningQuestionnaireFail = () => ({
  type: 'PUBLISH_SCREENING_QUESTIONNAIRE_FAIL'
});

const deleteScreeningQuestionnaireRequest = () => ({
  type: 'DELETE_SCREENING_QUESTIONNAIRE_REQUEST'
});

const deleteScreeningQuestionnaireSuccess = (data) => ({
  type: 'DELETE_SCREENING_QUESTIONNAIRE_SUCCESS',
  data
});

const deleteScreeningQuestionnaireFail = () => ({
  type: 'DELETE_SCREENING_QUESTIONNAIRE_FAIL'
});

export const mutation = {
  getScreeningQuestionnairesRequest,
  getScreeningQuestionnairesSuccess,
  getScreeningQuestionnairesFail,
  getScreeningQuestionnaireRequest,
  getScreeningQuestionnaireSuccess,
  getScreeningQuestionnaireFail,
  createScreeningQuestionnaireRequest,
  createScreeningQuestionnaireSuccess,
  createScreeningQuestionnaireFail,
  updateScreeningQuestionnaireRequest,
  updateScreeningQuestionnaireSuccess,
  updateScreeningQuestionnaireFail,
  publishScreeningQuestionnaireRequest,
  publishScreeningQuestionnaireSuccess,
  publishScreeningQuestionnaireFail,
  deleteScreeningQuestionnaireRequest,
  deleteScreeningQuestionnaireSuccess,
  deleteScreeningQuestionnaireFail
};

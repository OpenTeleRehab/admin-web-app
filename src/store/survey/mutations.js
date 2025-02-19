const getSurveysRequest = () => ({
  type: 'GET_SURVEYS_REQUEST'
});

const getSurveysSuccess = (data) => ({
  type: 'GET_SURVEYS_SUCCESS',
  data
});

const getSurveysFail = () => ({
  type: 'GET_SURVEYS_FAIL'
});

const getSurveyRequest = () => ({
  type: 'GET_SURVEY_REQUEST'
});

const getSurveySuccess = (data) => ({
  type: 'GET_SURVEY_SUCCESS',
  data
});

const getSurveyFail = () => ({
  type: 'GET_SURVEY_FAIL'
});

const getPublishSurveyRequest = () => ({
  type: 'GET_PUBLISH_SURVEY_REQUEST'
});

const getPublishSurveySuccess = (data) => ({
  type: 'GET_PUBLISH_SURVEY_SUCCESS',
  data
});

const getPublishSurveyFail = () => ({
  type: 'GET_PUBLISH_SURVEY_FAIL'
});

const createSurveyRequest = () => ({
  type: 'CREATE_SURVEY_REQUEST'
});

const createSurveySuccess = () => ({
  type: 'CREATE_SURVEY_SUCCESS'
});

const createSurveyFail = () => ({
  type: 'CREATE_SURVEY_FAIL'
});

const updateSurveyRequest = () => ({
  type: 'UPDATE_SURVEY_REQUEST'
});

const updateSurveySuccess = () => ({
  type: 'UPDATE_SURVEY_SUCCESS'
});

const updateSurveyFail = () => ({
  type: 'UPDATE_SURVEY_FAIL'
});

const publishSurveyRequest = () => ({
  type: 'PUBLISH_SURVEY_REQUEST'
});

const publishSurveySuccess = (data) => ({
  type: 'PUBLISH_SURVEY_SUCCESS',
  data
});

const publishSurveyFail = () => ({
  type: 'PUBLISH_SURVEY_FAIL'
});

const submitSurveyRequest = () => ({
  type: 'SUBMIT_SURVEY_REQUEST'
});

const submitSurveySuccess = (data) => ({
  type: 'SUBMIT_SURVEY_SUCCESS',
  data
});

const submitSurveyFail = () => ({
  type: 'SUBMIT_SURVEY_FAIL'
});

const skipSurveyRequest = () => ({
  type: 'SKIP_SURVEY_REQUEST'
});

const skipSurveySuccess = (data) => ({
  type: 'SKIP_SURVEY_SUCCESS',
  data
});

const skipSurveyFail = () => ({
  type: 'SKIP_SURVEY_FAIL'
});

export const mutation = {
  getSurveysRequest,
  getSurveysSuccess,
  getSurveysFail,
  getSurveyRequest,
  getSurveySuccess,
  getSurveyFail,
  getPublishSurveyRequest,
  getPublishSurveySuccess,
  getPublishSurveyFail,
  createSurveyRequest,
  createSurveySuccess,
  createSurveyFail,
  updateSurveyRequest,
  updateSurveySuccess,
  updateSurveyFail,
  publishSurveyRequest,
  publishSurveySuccess,
  publishSurveyFail,
  submitSurveyRequest,
  submitSurveySuccess,
  submitSurveyFail,
  skipSurveyRequest,
  skipSurveySuccess,
  skipSurveyFail
};

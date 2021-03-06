const getTermAndConditionsRequest = () => ({
  type: 'GET_TERM_AND_CONDITIONS_REQUEST'
});

const getTermAndConditionsSuccess = (data) => ({
  type: 'GET_TERM_AND_CONDITIONS_SUCCESS',
  data
});

const getTermAndConditionsFail = () => ({
  type: 'GET_TERM_AND_CONDITIONS_FAIL'
});

const createTermAndConditionRequest = () => ({
  type: 'CREATE_TERM_AND_CONDITION_REQUEST'
});

const createTermAndConditionSuccess = () => ({
  type: 'CREATE_TERM_AND_CONDITION_SUCCESS'
});

const createTermAndConditionFail = () => ({
  type: 'CREATE_TERM_AND_CONDITION_FAIL'
});

const updateTermAndConditionRequest = () => ({
  type: 'UPDATE_TERM_AND_CONDITION_REQUEST'
});

const updateTermAndConditionSuccess = () => ({
  type: 'UPDATE_TERM_AND_CONDITION_SUCCESS'
});

const updateTermAndConditionFail = () => ({
  type: 'UPDATE_TERM_AND_CONDITION_FAIL'
});

const getTermAndConditionRequest = () => ({
  type: 'GET_TERM_AND_CONDITION_REQUEST'
});

const getTermAndConditionSuccess = (data) => ({
  type: 'GET_TERM_AND_CONDITION_SUCCESS',
  data
});

const getTermAndConditionFail = () => ({
  type: 'GET_TERM_AND_CONDITION_FAIL'
});

const getPublishTermConditionRequest = () => ({
  type: 'GET_PUBLISH_TERM_CONDITION_REQUEST'
});

const getPublishTermConditionSuccess = (data) => ({
  type: 'GET_PUBLISH_TERM_CONDITION_SUCCESS',
  data
});

const getPublishTermConditionFail = () => ({
  type: 'GET_PUBLISH_TERM_CONDITION_FAIL'
});

export const mutation = {
  getTermAndConditionsRequest,
  getTermAndConditionsSuccess,
  getTermAndConditionsFail,
  getTermAndConditionRequest,
  getTermAndConditionSuccess,
  getTermAndConditionFail,
  createTermAndConditionRequest,
  createTermAndConditionSuccess,
  createTermAndConditionFail,
  updateTermAndConditionRequest,
  updateTermAndConditionSuccess,
  updateTermAndConditionFail,
  getPublishTermConditionRequest,
  getPublishTermConditionSuccess,
  getPublishTermConditionFail
};

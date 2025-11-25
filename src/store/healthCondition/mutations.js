const getHealthConditionsRequest = () => ({
  type: 'GET_HEALTH_CONDITIONS_REQUEST'
});

const getHealthConditionsSuccess = (data) => ({
  type: 'GET_HEALTH_CONDITIONS_SUCCESS',
  data
});

const getHealthConditionsFail = () => ({
  type: 'GET_HEALTH_CONDITIONS_FAIL'
});

const getHealthConditionRequest = () => ({
  type: 'GET_HEALTH_CONDITION_REQUEST'
});

const getHealthConditionSuccess = (data) => ({
  type: 'GET_HEALTH_CONDITION_SUCCESS',
  data
});

const getHealthConditionFail = () => ({
  type: 'GET_HEALTH_CONDITION_FAIL'
});

const createHealthConditionRequest = () => ({
  type: 'CREATE_HEALTH_CONDITION_REQUEST'
});

const createHealthConditionSuccess = () => ({
  type: 'CREATE_HEALTH_CONDITION_SUCCESS'
});

const createHealthConditionFail = () => ({
  type: 'CREATE_HEALTH_CONDITION_FAIL'
});

const updateHealthConditionRequest = () => ({
  type: 'UPDATE_HEALTH_CONDITION_REQUEST'
});

const updateHealthConditionSuccess = () => ({
  type: 'UPDATE_HEALTH_CONDITION_SUCCESS'
});

const updateHealthConditionFail = () => ({
  type: 'UPDATE_HEALTH_CONDITION_FAIL'
});

const deleteHealthConditionRequest = () => ({
  type: 'DELETE_HEALTH_CONDITION_REQUEST'
});

const deleteHealthConditionSuccess = () => ({
  type: 'DELETE_HEALTH_CONDITION_SUCCESS'
});

const deleteHealthConditionFail = () => ({
  type: 'DELETE_HEALTH_CONDITION_FAIL'
});

export const mutation = {
  getHealthConditionsRequest,
  getHealthConditionsSuccess,
  getHealthConditionsFail,
  getHealthConditionRequest,
  getHealthConditionSuccess,
  getHealthConditionFail,
  createHealthConditionRequest,
  createHealthConditionSuccess,
  createHealthConditionFail,
  updateHealthConditionRequest,
  updateHealthConditionSuccess,
  updateHealthConditionFail,
  deleteHealthConditionRequest,
  deleteHealthConditionSuccess,
  deleteHealthConditionFail
};

const getHealthConditionGroupsRequest = () => ({
  type: 'GET_HEALTH_CONDITION_GROUPS_REQUEST'
});

const getHealthConditionGroupsSuccess = (data) => ({
  type: 'GET_HEALTH_CONDITION_GROUPS_SUCCESS',
  data
});

const getHealthConditionGroupsFail = () => ({
  type: 'GET_HEALTH_CONDITION_GROUPS_FAIL'
});

const getHealthConditionGroupRequest = () => ({
  type: 'GET_HEALTH_CONDITION_GROUP_REQUEST'
});

const getHealthConditionGroupSuccess = (data) => ({
  type: 'GET_HEALTH_CONDITION_GROUP_SUCCESS',
  data
});

const getHealthConditionGroupFail = () => ({
  type: 'GET_HEALTH_CONDITION_GROUP_FAIL'
});

const createHealthConditionGroupRequest = () => ({
  type: 'CREATE_HEALTH_CONDITION_GROUP_REQUEST'
});

const createHealthConditionGroupSuccess = () => ({
  type: 'CREATE_HEALTH_CONDITION_GROUP_SUCCESS'
});

const createHealthConditionGroupFail = () => ({
  type: 'CREATE_HEALTH_CONDITION_GROUP_FAIL'
});

const updateHealthConditionGroupRequest = () => ({
  type: 'UPDATE_HEALTH_CONDITION_GROUP_REQUEST'
});

const updateHealthConditionGroupSuccess = () => ({
  type: 'UPDATE_HEALTH_CONDITION_GROUP_SUCCESS'
});

const updateHealthConditionGroupFail = () => ({
  type: 'UPDATE_HEALTH_CONDITION_GROUP_FAIL'
});

const deleteHealthConditionGroupRequest = () => ({
  type: 'DELETE_HEALTH_CONDITION_GROUP_REQUEST'
});

const deleteHealthConditionGroupSuccess = () => ({
  type: 'DELETE_HEALTH_CONDITION_GROUP_SUCCESS'
});

const deleteHealthConditionGroupFail = () => ({
  type: 'DELETE_HEALTH_CONDITION_GROUP_FAIL'
});

export const mutation = {
  getHealthConditionGroupsRequest,
  getHealthConditionGroupsSuccess,
  getHealthConditionGroupsFail,
  getHealthConditionGroupRequest,
  getHealthConditionGroupSuccess,
  getHealthConditionGroupFail,
  createHealthConditionGroupRequest,
  createHealthConditionGroupSuccess,
  createHealthConditionGroupFail,
  updateHealthConditionGroupRequest,
  updateHealthConditionGroupSuccess,
  updateHealthConditionGroupFail,
  deleteHealthConditionGroupRequest,
  deleteHealthConditionGroupSuccess,
  deleteHealthConditionGroupFail
};

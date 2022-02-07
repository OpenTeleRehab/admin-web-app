const getOrganizationsRequest = () => ({
  type: 'GET_ORGANIZATIONS_REQUEST'
});

const getOrganizationsSuccess = (data) => ({
  type: 'GET_ORGANIZATIONS_SUCCESS',
  data
});

const getOrganizationsFail = () => ({
  type: 'GET_ORGANIZATIONS_FAIL'
});

const getOrganizationRequest = () => ({
  type: 'GET_ORGANIZATION_REQUEST'
});

const getOrganizationSuccess = (data) => ({
  type: 'GET_ORGANIZATION_SUCCESS',
  data
});

const getOrganizationFail = () => ({
  type: 'GET_ORGANIZATION_FAIL'
});

const createOrganizationRequest = () => ({
  type: 'CREATE_ORGANIZATION_REQUEST'
});

const createOrganizationSuccess = (data) => ({
  type: 'CREATE_ORGANIZATION_SUCCESS',
  data
});

const createOrganizationFail = () => ({
  type: 'CREATE_ORGANIZATION_FAIL'
});

const updateOrganizationRequest = () => ({
  type: 'UPDATE_ORGANIZATION_REQUEST'
});

const updateOrganizationSuccess = (data) => ({
  type: 'UPDATE_ORGANIZATION_SUCCESS',
  data
});

const updateOrganizationFail = () => ({
  type: 'UPDATE_ORGANIZATION_FAIL'
});

const deleteOrganizationRequest = () => ({
  type: 'DELETE_ORGANIZATION_REQUEST'
});

const deleteOrganizationSuccess = (data) => ({
  type: 'DELETE_ORGANIZATION_SUCCESS',
  data
});

const deleteOrganizationFail = () => ({
  type: 'DELETE_ORGANIZATION_FAIL'
});

export const mutation = {
  getOrganizationsFail,
  getOrganizationsRequest,
  getOrganizationsSuccess,
  getOrganizationRequest,
  getOrganizationSuccess,
  getOrganizationFail,
  createOrganizationRequest,
  createOrganizationSuccess,
  createOrganizationFail,
  updateOrganizationRequest,
  updateOrganizationSuccess,
  updateOrganizationFail,
  deleteOrganizationRequest,
  deleteOrganizationSuccess,
  deleteOrganizationFail
};

const getAssistiveTechnologiesRequest = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGIES_REQUEST'
});

const getAssistiveTechnologiesSuccess = (data) => ({
  type: 'GET_ASSISTIVE_TECHNOLOGIES_SUCCESS',
  data
});

const getAssistiveTechnologiesFail = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGIES_FAIL'
});

const getAssistiveTechnologyRequest = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGY_REQUEST'
});

const getAssistiveTechnologySuccess = (data) => ({
  type: 'GET_ASSISTIVE_TECHNOLOGY_SUCCESS',
  data
});

const getAssistiveTechnologyFail = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGY_FAIL'
});

const createAssistiveTechnologyRequest = () => ({
  type: 'CREATE_ASSISTIVE_TECHNOLOGY_REQUEST'
});

const createAssistiveTechnologySuccess = () => ({
  type: 'CREATE_DISEASE_SUCCESS'
});

const createAssistiveTechnologyFail = () => ({
  type: 'CREATE_DISEASE_FAIL'
});

const updateAssistiveTechnologyRequest = () => ({
  type: 'UPDATE_DISEASE_REQUEST'
});

const updateAssistiveTechnologySuccess = () => ({
  type: 'UPDATE_DISEASE_SUCCESS'
});

const updateAssistiveTechnologyFail = () => ({
  type: 'UPDATE_DISEASE_FAIL'
});

const deleteAssistiveTechnologyRequest = () => ({
  type: 'DELETE_DISEASE_REQUEST'
});

const deleteAssistiveTechnologySuccess = (data) => ({
  type: 'DELETE_DISEASE_SUCCESS',
  data
});

const deleteAssistiveTechnologyFail = () => ({
  type: 'DELETE_DISEASE_FAIL'
});

const getAssistiveTechnologyPatientsRequest = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGY_PATIENTS_REQUEST'
});

const getAssistiveTechnologyPatientsSuccess = (data) => ({
  type: 'GET_ASSISTIVE_TECHNOLOGY_PATIENTS_SUCCESS',
  data
});

const getAssistiveTechnologyPatientsFail = () => ({
  type: 'GET_ASSISTIVE_TECHNOLOGY_PATIENTS_FAIL'
});

export const mutation = {
  getAssistiveTechnologiesRequest,
  getAssistiveTechnologiesSuccess,
  getAssistiveTechnologiesFail,
  getAssistiveTechnologyRequest,
  getAssistiveTechnologySuccess,
  getAssistiveTechnologyFail,
  getAssistiveTechnologyPatientsRequest,
  getAssistiveTechnologyPatientsSuccess,
  getAssistiveTechnologyPatientsFail,
  createAssistiveTechnologyRequest,
  createAssistiveTechnologySuccess,
  createAssistiveTechnologyFail,
  updateAssistiveTechnologyRequest,
  updateAssistiveTechnologySuccess,
  updateAssistiveTechnologyFail,
  deleteAssistiveTechnologyRequest,
  deleteAssistiveTechnologySuccess,
  deleteAssistiveTechnologyFail
};

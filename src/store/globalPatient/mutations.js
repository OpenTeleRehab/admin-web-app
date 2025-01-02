const getPatientRequest = () => ({
  type: 'GET_PATIENT_REQUEST'
});

const getPatientSuccess = (data) => ({
  type: 'GET_PATIENT_SUCCESS',
  data
});

const getPatientFail = () => ({
  type: 'GET_PATIENT_FAIL'
});

const deleteGlobalPatientRequest = () => ({
  type: 'DELETE_GLOBAL_PATIENT_REQUEST'
});

const deleteGlobalPatientSuccess = (data) => ({
  type: 'DELETE_GLOBAL_PATIENT_SUCCESS',
  data
});

const deleteGlobalPatientFail = () => ({
  type: 'DELETE_GLOBAL_PATIENT_FAIL'
});

const downloadPatientRawDataRequest = () => ({
  type: 'DOWNLOAD_PATIENT_RAW_DATA_REQUEST'
});

const downloadPatientRawDataSuccess = () => ({
  type: 'DOWNLOAD_PATIENT_RAW_DATA_SUCCESS'
});

const downloadPatientRawDataFail = () => ({
  type: 'DOWNLOAD_PATIENT_RAW_DATA_FAIL'
});

export const mutation = {
  getPatientRequest,
  getPatientSuccess,
  getPatientFail,
  deleteGlobalPatientRequest,
  deleteGlobalPatientSuccess,
  deleteGlobalPatientFail,
  downloadPatientRawDataRequest,
  downloadPatientRawDataSuccess,
  downloadPatientRawDataFail
};

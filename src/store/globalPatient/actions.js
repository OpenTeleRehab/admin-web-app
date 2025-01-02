import { GlobalPatient } from 'services/globalPatient';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from '../notification/actions';
import { saveAs } from 'file-saver';

export const getGlobalPatients = payload => async (dispatch, getState) => {
  dispatch(mutation.getPatientRequest());
  const data = await GlobalPatient.getGlobalPatients(payload);
  if (data.success) {
    dispatch(mutation.getPatientSuccess(data.data));
    return data.info;
  } else {
    dispatch(mutation.getPatientFail());
    return false;
  }
};

export const deleteGlobalPatient = id => async (dispatch, getState) => {
  dispatch(mutation.deleteGlobalPatientRequest());
  const data = await GlobalPatient.deleteGlobalPatient(id);
  if (data.success) {
    dispatch(mutation.deleteGlobalPatientSuccess());
    const filters = getState().patient.filters;
    dispatch(getGlobalPatients(filters));
    dispatch(showSuccessNotification('toast_title.delete_patient', data.message));
    return true;
  } else {
    dispatch(mutation.deleteGlobalPatientFail());
    dispatch(showErrorNotification('toast_title.delete_patient', data.message));
    return false;
  }
};

export const downloadPatientRawData = payload => async dispatch => {
  dispatch(mutation.downloadPatientRawDataRequest());
  const res = await GlobalPatient.downloadPatientRawData(payload);
  if (res) {
    dispatch(mutation.downloadPatientRawDataSuccess());
    saveAs(res, 'Patient_Raw_Data.xlsx');
    return true;
  } else {
    dispatch(mutation.downloadPatientRawDataFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
    return false;
  }
};

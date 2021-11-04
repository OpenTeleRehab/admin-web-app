import { GlobalPatient } from 'services/globalPatient';
import { mutation } from './mutations';

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

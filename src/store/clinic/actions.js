import { Clinic } from 'services/clinic';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import {
  showSpinner
} from 'store/spinnerOverlay/actions';

export const getClinics = () => async dispatch => {
  dispatch(mutation.getClinicsRequest());
  const data = await Clinic.getClinics();
  if (data.success) {
    dispatch(mutation.getClinicsSuccess(data.data));
  } else {
    dispatch(mutation.getClinicsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

// Actions
export const createClinic = payload => async (dispatch) => {
  dispatch(mutation.createClinicRequest());
  dispatch(showSpinner(true));
  const data = await Clinic.createClinic(payload);
  if (data.success) {
    dispatch(mutation.createClinicSuccess());
    dispatch(getClinics());
    dispatch(showSuccessNotification('toast_title.new_clinic', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createClinicFail());
    dispatch(showErrorNotification('toast_title.new_clinic', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateClinic = (id, payload) => async (dispatch) => {
  dispatch(mutation.updateClinicRequest());
  const data = await Clinic.updateClinic(id, payload);
  if (data.success) {
    dispatch(mutation.updateClinicSuccess());
    dispatch(getClinics());
    dispatch(showSuccessNotification('toast_title.edit_clinic', data.message));
    return true;
  } else {
    dispatch(mutation.updateClinicFail());
    dispatch(showErrorNotification('toast_title.edit_clinic', data.message, { ...data.translate_params }));
    return false;
  }
};

export const deleteClinic = id => async (dispatch, getState) => {
  dispatch(mutation.deleteClinicRequest());
  const data = await Clinic.deleteClinic(id);
  if (data.success) {
    dispatch(mutation.deleteClinicSuccess());
    const filters = getState().clinic.filters;
    dispatch(getClinics(filters));
    dispatch(showSuccessNotification('toast_title.delete_clinic', data.message));
    return true;
  } else {
    dispatch(mutation.deleteClinicFail());
    dispatch(showErrorNotification('toast_title.delete_clinic', data.message));
    return false;
  }
};

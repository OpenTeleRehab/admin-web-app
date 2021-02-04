import { EducationMaterial } from 'services/educationMaterial';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getEducationMaterial = (id, language) => async dispatch => {
  dispatch(mutation.getEducationMaterialRequest());
  dispatch(showSpinner(true));
  const data = await EducationMaterial.getEducationMaterial(id, language);
  if (data) {
    dispatch(mutation.getEducationMaterialSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getEducationMaterialFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getEducationMaterials = payload => async dispatch => {
  dispatch(mutation.getEducationMaterialsRequest());
  dispatch(showSpinner(true));
  const data = await EducationMaterial.getEducationMaterials(payload);
  if (data.success) {
    dispatch(mutation.getEducationMaterialsSuccess(data.data, payload));
    dispatch(showSpinner(false));
    return data.info;
  } else {
    dispatch(mutation.getEducationMaterialsFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createEducationMaterial = (payload) => async dispatch => {
  dispatch(mutation.createEducationMaterialRequest());
  const data = await EducationMaterial.createEducationMaterial(payload);
  if (data.success) {
    dispatch(mutation.createEducationMaterialSuccess());
    dispatch(showSuccessNotification('toast_title.new_education_material', data.message));
    return true;
  } else {
    dispatch(mutation.createEducationMaterialFail());
    dispatch(showErrorNotification('toast_title.new_education_material', data.message));
    return false;
  }
};

export const updateEducationMaterial = (id, payload, mediaUploads) => async dispatch => {
  dispatch(mutation.updateEducationMaterialRequest());
  const data = await EducationMaterial.updateEducationMaterial(id, payload, mediaUploads);
  if (data.success) {
    dispatch(mutation.updateEducationMaterialSuccess());
    dispatch(getEducationMaterials());
    dispatch(showSuccessNotification('toast_title.update_education_material', data.message));
    return true;
  } else {
    dispatch(mutation.updateEducationMaterialFail());
    dispatch(showErrorNotification('toast_title.update_education_material', data.message));
    return false;
  }
};

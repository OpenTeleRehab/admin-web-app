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
    dispatch(showSuccessNotification('toast_title.update_education_material', data.message));
    return true;
  } else {
    dispatch(mutation.updateEducationMaterialFail());
    dispatch(showErrorNotification('toast_title.update_education_material', data.message));
    return false;
  }
};

export const deleteEducationMaterial = id => async (dispatch, getState) => {
  dispatch(mutation.deleteEducationMaterialRequest());
  const data = await EducationMaterial.deleteEducationMaterial(id);
  if (data.success) {
    dispatch(mutation.deleteEducationMaterialSuccess());
    const filters = getState().educationMaterial.filters;
    dispatch(getEducationMaterials(filters));
    dispatch(showSuccessNotification('toast_title.delete_education_material', data.message));
    return true;
  } else {
    dispatch(mutation.deleteEducationMaterialFail());
    dispatch(showErrorNotification('toast_title.delete_education_material', data.message));
    return false;
  }
};

export const clearFilterEducationMaterials = () => async dispatch => {
  dispatch(mutation.clearFilterEducationMaterialsRequest());
};

export const approveTranslation = (id, payload) => async (dispatch) => {
  dispatch(mutation.approveTranslationRequest());
  const data = await EducationMaterial.approveTranslation(id, payload);
  if (data.success) {
    dispatch(mutation.approveTranslationSuccess());
    dispatch(showSuccessNotification('toast_title.translation.approve', 'success_message.translation.approve'));
    return true;
  } else {
    dispatch(mutation.approveTranslationFail());
    dispatch(showSuccessNotification('toast_title.translation.approve', 'error_message.translation.approve'));
    return false;
  }
};

export const rejectTranslation = (id) => async dispatch => {
  dispatch(mutation.rejectTranslationRequest());
  const data = await EducationMaterial.rejectTranslation(id);
  if (data.success) {
    dispatch(mutation.rejectTranslationSuccess());
    dispatch(showSuccessNotification('toast_title.translation.reject', 'success_message.translation.reject'));
    return true;
  } else {
    dispatch(mutation.rejectTranslationFail());
    dispatch(showErrorNotification('toast_title.translation.reject', 'error_message.translation.reject'));
    return false;
  }
};

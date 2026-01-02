import { saveAs } from 'file-saver';
import { Exercise } from 'services/exercise';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';

export const getExercises = payload => async dispatch => {
  dispatch(mutation.getExercisesRequest());
  const data = await Exercise.getExercises(payload);
  if (data.success) {
    dispatch(mutation.getExercisesSuccess(data.data, payload, data.info));
  } else {
    dispatch(mutation.getExercisesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getExercise = (id, language) => async dispatch => {
  dispatch(mutation.getExerciseRequest());
  dispatch(showSpinner(true));
  const data = await Exercise.getExercise(id, language);
  if (data) {
    dispatch(mutation.getExerciseSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getExerciseFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createExercise = (payload, mediaUploads) => async dispatch => {
  dispatch(mutation.createExerciseRequest());
  const data = await Exercise.createExercise(payload, mediaUploads);
  if (data.success) {
    dispatch(mutation.createExerciseSuccess());
    dispatch(showSuccessNotification('toast_title.new_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.createExerciseFail());
    dispatch(showErrorNotification('toast_title.new_exercise', data.message));
    return false;
  }
};

export const updateExercise = (id, payload, mediaUploads) => async dispatch => {
  dispatch(mutation.updateExerciseRequest());
  const data = await Exercise.updateExercise(id, payload, mediaUploads);
  if (data.success) {
    dispatch(mutation.updateExerciseSuccess());
    dispatch(showSuccessNotification('toast_title.update_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.updateExerciseFail());
    dispatch(showErrorNotification('toast_title.update_exercise', data.message));
    return false;
  }
};

export const deleteExercise = id => async (dispatch, getState) => {
  dispatch(mutation.deleteExerciseRequest());
  const data = await Exercise.deleteExercise(id);
  if (data.success) {
    dispatch(mutation.deleteExerciseSuccess());
    const filters = getState().exercise.filters;
    dispatch(getExercises(filters));
    dispatch(showSuccessNotification('toast_title.delete_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.deleteExerciseFail());
    dispatch(showErrorNotification('toast_title.delete_exercise', data.message));
    return false;
  }
};

export const clearFilterExercises = () => async dispatch => {
  dispatch(mutation.clearFilterExercisesRequest());
};

export const downloadExercises = payload => async dispatch => {
  dispatch(mutation.downloadExercisesRequest());
  const res = await Exercise.downloadExercises(payload);
  if (res) {
    dispatch(mutation.downloadExercisesSuccess());
    saveAs(res, 'Exercise.csv');
    return true;
  } else {
    dispatch(mutation.downloadExercisesFail());
    dispatch(showErrorNotification('toast_title.error_message', res.message));
    return false;
  }
};

export const uploadExercises = payload => async dispatch => {
  dispatch(mutation.uploadExercisesRequest());
  const data = await Exercise.uploadExercises(payload);
  if (data.success) {
    dispatch(mutation.uploadExercisesSuccess());
    dispatch(showSuccessNotification('toast_title.upload_exercises', data.message));
    return { success: true, info: data.info };
  } else {
    dispatch(mutation.uploadExercisesFail());
    dispatch(showErrorNotification('toast_title.upload_exercises', data.message));
    return { success: false, info: data.errors };
  }
};

export const approveTranslation = (id, payload) => async (dispatch) => {
  dispatch(mutation.approveTranslationRequest());
  const data = await Exercise.approveTranslation(id, payload);
  if (data.success) {
    dispatch(mutation.approveTranslationSuccess());
    dispatch(showSuccessNotification('toast_title.translation.approve', 'success_message.translation.approve'));
    return true;
  } else {
    dispatch(mutation.approveTranslationFail());
    dispatch(showErrorNotification('toast_title.translation.approve', 'error_message.translation.approve'));
    return false;
  }
};

export const rejectTranslation = (id) => async dispatch => {
  dispatch(mutation.rejectTranslationRequest());
  const data = await Exercise.rejectTranslation(id);
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

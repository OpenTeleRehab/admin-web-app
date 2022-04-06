import { Auth } from 'services/auth';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { getTranslations } from 'store/translation/actions';
import { clearFilterExercises } from 'store/exercise/actions';
import { clearFilterEducationMaterials } from 'store/educationMaterial/actions';
import { clearFilterQuestionnaires } from 'store/questionnaire/actions';

// Actions
export const getProfile = () => async dispatch => {
  dispatch(mutation.getProfileRequest());
  const data = await Auth.getProfile();
  if (data) {
    dispatch(mutation.getProfileSuccess(data.data));
    return data;
  } else {
    dispatch(mutation.getProfileFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updatePassword = payload => async dispatch => {
  dispatch(mutation.updatePasswordRequest());
  const data = await Auth.updatePassword(payload);
  if (data.success) {
    dispatch(mutation.updatePasswordSuccess());
    dispatch(showSuccessNotification('toast_title.change_password', 'success_message.change_password_success'));
    return true;
  } else {
    dispatch(mutation.updatePasswordFail());
    dispatch(showErrorNotification('toast_title.change_password', data.message));
    return false;
  }
};

export const updateUserProfile = payload => async dispatch => {
  dispatch(mutation.updateUserProfileRequest());
  const data = await Auth.updateUserProfile(payload);
  if (data.success) {
    dispatch(mutation.updateUserProfileSuccess());
    dispatch(getTranslations());
    dispatch(getProfile());
    dispatch(clearFilterExercises());
    dispatch(clearFilterEducationMaterials());
    dispatch(clearFilterQuestionnaires());
    dispatch(showSuccessNotification('toast_title.edit_profile', data.message));
    return true;
  } else {
    dispatch(mutation.updateUserProfileFail());
    dispatch(showErrorNotification('toast_title.edit_profile', data.message));
    return false;
  }
};

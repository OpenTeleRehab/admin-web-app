import { guidancePage } from 'services/guidancePage';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getGuidancePages = payload => async dispatch => {
  dispatch(mutation.getGuidancePagesRequest());
  const data = await guidancePage.getGuidancePages(payload);
  if (data.success) {
    dispatch(mutation.getGuidancePagesSuccess(data.data, payload));
  } else {
    dispatch(mutation.getGuidancePagesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getGuidancePage = (id, language) => async dispatch => {
  dispatch(mutation.getGuidancePagesRequest());
  dispatch(showSpinner(true));
  const data = await guidancePage.getGuidancePage(id, language);
  if (data) {
    dispatch(mutation.getGuidancePageSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getGuidancePageFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

// Actions
export const createGuidancePage = (payload) => async (dispatch) => {
  dispatch(mutation.createGuidancePageRequest());
  dispatch(showSpinner(true));
  const data = await guidancePage.createGuidancePage(payload);
  if (data.success) {
    dispatch(mutation.createGuidancePageSuccess());
    dispatch(getGuidancePages());
    dispatch(showSuccessNotification('toast_title.new_guidance_page', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createGuidancePagesFail());
    dispatch(showErrorNotification('toast_title.new_static_page', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const updateGuidancePage = (id, payload) => async dispatch => {
  dispatch(mutation.updateGuidancePageRequest());
  const data = await guidancePage.updateGuidancePage(id, payload);
  if (data.success) {
    dispatch(mutation.updateGuidancePageSuccess());
    dispatch(getGuidancePages());
    dispatch(showSuccessNotification('toast_title.update_guidance_page', data.message));
    return true;
  } else {
    dispatch(mutation.updateGuidancePageFail());
    dispatch(showErrorNotification('toast_title.update_guidance_page', data.message));
    return false;
  }
};

export const updateGuidancePages = (payload) => async dispatch => {
  dispatch(mutation.updateGuidancePagesRequest());
  const data = await guidancePage.updateGuidancePages(payload);
  if (data.success) {
    dispatch(mutation.updateGuidancePagesSuccess());
    dispatch(getGuidancePages({ lang: payload.lang }));
    return true;
  } else {
    dispatch(mutation.updateGuidancePagesFail());
    return false;
  }
};

export const deleteGuidance = id => async (dispatch) => {
  dispatch(mutation.deleteGuidanceRequest());
  const data = await guidancePage.deleteGuidancePage(id);
  if (data.success) {
    dispatch(mutation.deleteGuidanceSuccess());
    dispatch(getGuidancePages());
    dispatch(showSuccessNotification('toast_title.delete_guidance_page', data.message));
    return true;
  } else {
    dispatch(mutation.deleteGuidanceFail());
    dispatch(showErrorNotification('toast_title.delete_guidance_page', data.message));
    return false;
  }
};

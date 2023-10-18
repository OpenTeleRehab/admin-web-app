import { staticPage } from 'services/staticPage';
import { mutation } from './mutations';
import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';
import { showSpinner } from '../spinnerOverlay/actions';

export const getStaticPages = payload => async dispatch => {
  dispatch(mutation.getStaticPagesRequest());
  dispatch(showSpinner(true));
  const data = await staticPage.getStaticPages(payload);
  if (data.success) {
    dispatch(mutation.getStaticPagesSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getStaticPagesFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getStaticPage = (id, language) => async dispatch => {
  dispatch(mutation.getStaticPageRequest());
  dispatch(showSpinner(true));
  const data = await staticPage.getStaticPage(id, language);
  if (data) {
    dispatch(mutation.getStaticPageSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getStaticPageFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateStaticPage = (id, payload) => async dispatch => {
  dispatch(mutation.updateStaticPageRequest());
  const data = await staticPage.updateStaticPage(id, payload);
  if (data.success) {
    dispatch(mutation.updateStaticPageSuccess());
    dispatch(getStaticPages());
    dispatch(showSuccessNotification('toast_title.update_static_page', data.message));
    return true;
  } else {
    dispatch(mutation.updateStaticPagesFail());
    dispatch(showErrorNotification('toast_title.update_static_page', data.message));
    return false;
  }
};

// Actions
export const createStaticPage = (payload) => async (dispatch) => {
  dispatch(mutation.createStaticPageRequest());
  dispatch(showSpinner(true));
  const data = await staticPage.createStaticPage(payload);
  if (data.success) {
    dispatch(mutation.createStaticPageSuccess());
    dispatch(getStaticPages());
    dispatch(showSuccessNotification('toast_title.new_static_page', data.message));
    dispatch(showSpinner(false));
    return true;
  } else {
    dispatch(mutation.createStaticPagesFail());
    dispatch(showErrorNotification('toast_title.new_static_page', data.message));
    dispatch(showSpinner(false));
    return false;
  }
};

export const getFaqPage = payload => async dispatch => {
  dispatch(mutation.getFaqPageRequest());
  dispatch(showSpinner(true));
  const data = await staticPage.getFaqPage(payload);
  if (data.success) {
    dispatch(mutation.getFaqPageSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getFaqPageFail());
    dispatch(showSpinner(false));
    console.log(data.message);
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

import { Organization } from 'services/organization';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';

export const getOrganizations = payload => async dispatch => {
  dispatch(mutation.getOrganizationsRequest());
  const data = await Organization.getOrganizations(payload);
  if (data.success) {
    dispatch(mutation.getOrganizationsSuccess(data.data));
  } else {
    dispatch(mutation.getOrganizationsFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const getOrganization = (id, language) => async dispatch => {
  dispatch(mutation.getOrganizationRequest());
  dispatch(showSpinner(true));
  const data = await Organization.getOrganization(id, language);
  if (data) {
    dispatch(mutation.getOrganizationSuccess(data.data));
    dispatch(showSpinner(false));
  } else {
    dispatch(mutation.getOrganizationFail());
    dispatch(showSpinner(false));
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createOrganization = (payload) => async dispatch => {
  dispatch(mutation.createOrganizationRequest());
  const data = await Organization.createOrganization(payload);
  if (data.success) {
    dispatch(mutation.createOrganizationSuccess());
    dispatch(getOrganizations());
    dispatch(showSuccessNotification('toast_title.new_organization', data.message));
    return true;
  } else {
    dispatch(mutation.createOrganizationFail());
    dispatch(showErrorNotification('toast_title.new_organization', data.message));
    return false;
  }
};

export const updateOrganization = (id, payload) => async dispatch => {
  dispatch(mutation.updateOrganizationRequest());
  const data = await Organization.updateOrganization(id, payload);
  if (data.success) {
    dispatch(mutation.updateOrganizationSuccess());
    dispatch(getOrganizations());
    dispatch(showSuccessNotification('toast_title.edit_organization', data.message));
    return true;
  } else {
    dispatch(mutation.updateOrganizationFail());
    dispatch(showErrorNotification('toast_title.edit_organization', data.message));
    return false;
  }
};

export const deleteOrganization = id => async (dispatch) => {
  dispatch(mutation.deleteOrganizationRequest());
  const data = await Organization.deleteOrganization(id);
  if (data.success) {
    dispatch(mutation.deleteOrganizationSuccess());
    dispatch(getOrganizations());
    dispatch(showSuccessNotification('toast_title.delete_organization', data.message));
    return true;
  } else {
    dispatch(mutation.deleteOrganizationFail());
    dispatch(showErrorNotification('toast_title.delete_organization', data.message));
    return false;
  }
};

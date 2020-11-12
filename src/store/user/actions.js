import { User } from 'services/user';
import { mutation } from './mutations';

import {
  showErrorNotification,
  showSuccessNotification
} from 'store/notification/actions';

// Actions
export const createUser = payload => async dispatch => {
  dispatch(mutation.createUserRequest());
  const data = await User.createUser(payload);
  if (data.success) {
    dispatch(mutation.createUserSuccess());
    dispatch(getUsers({ admin_type: payload.type }));
    dispatch(showSuccessNotification('toast_title.new_admin_account', data.message));
    return true;
  } else {
    dispatch(mutation.createUserFail());
    dispatch(showErrorNotification('New admin account', data.message));
    return false;
  }
};

export const getUsers = payload => async dispatch => {
  dispatch(mutation.getUsersRequest());
  const data = await User.getUsers(payload);
  if (data.success) {
    dispatch(mutation.getUsersSuccess(data.data));
  } else {
    dispatch(mutation.getUsersFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const updateUser = (id, payload) => async dispatch => {
  dispatch(mutation.updateUserRequest());
  const data = await User.updateUser(id, payload);
  if (data.success) {
    dispatch(mutation.updateUserSuccess());
    dispatch(getUsers({ admin_type: payload.type }));
    dispatch(showSuccessNotification('toast_title.edit_admin_account', data.message));
    return true;
  } else {
    dispatch(mutation.updateUserFail());
    dispatch(showErrorNotification('toast_title.edit_admin_account', data.message));
    return false;
  }
};
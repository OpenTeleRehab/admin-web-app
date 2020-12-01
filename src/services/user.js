import customAxios from 'utils/axios';
import axios from 'axios';

window.getUserAxiosCancel = undefined;
const CancelToken = axios.CancelToken;

const createUser = payload => {
  return customAxios.post('/admin', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getUsers = payload => {
  if (window.getUserAxiosCancel !== undefined) {
    window.getUserAxiosCancel();
  }
  return customAxios.get('/admin', {
    params: payload,
    cancelToken: new CancelToken(function executor (c) {
      window.getUserAxiosCancel = c;
    })
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    if (e.response && e.response.data) {
      return e.response.data;
    } else {
      return { success: false };
    }
  });
};

const updateUser = (id, payload) => {
  return customAxios.put(`/admin/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateUserProfile = (id, payload) => {
  return customAxios.put(`/user/update-information/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const User = {
  createUser,
  getUsers,
  updateUser,
  updateUserProfile
};

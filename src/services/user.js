import adminAxios from 'utils/axios';
import axios from 'axios';

window.getUserAxiosCancel = undefined;
const CancelToken = axios.CancelToken;

const createUser = payload => {
  return adminAxios.post('/admin', payload)
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
  return adminAxios.get('/admin', {
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
  return adminAxios.put(`/admin/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateUserStatus = (id, payload) => {
  return adminAxios.post(`/admin/updateStatus/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteUser = (id, payload) => {
  return adminAxios.delete(`/admin/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const resendEmail = (id) => {
  return adminAxios.post(`/admin/resend-email/${id}`)
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
  deleteUser,
  updateUserStatus,
  resendEmail
};

import customAxios from 'utils/axios';
import axios from 'axios';

window.getUserAxiosCancel = undefined;
const CancelToken = axios.CancelToken;

const createTranslator = payload => {
  return customAxios.post('/translator', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTranslators = payload => {
  if (window.getUserAxiosCancel !== undefined) {
    window.getUserAxiosCancel();
  }
  return customAxios.get('/translator', {
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

const updateTranslator = (id, payload) => {
  return customAxios.put(`/translator/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateTranslatorStatus = (id, payload) => {
  return customAxios.post(`/translator/updateStatus/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteTranslator = (id) => {
  return customAxios.delete(`/translator/${id}`)
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
  return customAxios.post(`/translator/resend-email/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Translator = {
  createTranslator,
  getTranslators,
  updateTranslator,
  deleteTranslator,
  updateTranslatorStatus,
  resendEmail
};

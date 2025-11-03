import axios from 'utils/axios';

const endPoint = '/mfa-settings';

const getMfaSettings = payload => {
  return axios.get(endPoint,
    {
      params: payload
    })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createMfaSetting = (payload) => {
  return axios.post(endPoint, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateMfaSetting = (id, payload) => {
  return axios.put(`${endPoint}/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const MfaSetting = {
  getMfaSettings,
  createMfaSetting,
  updateMfaSetting
};

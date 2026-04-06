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

const getMfaEnforcementValidation = async (role, regionId = null) => {
  try {
    const url = regionId ? `${endPoint}/validation?role=${role}&region_id=${regionId}` : `${endPoint}/validation?role=${role}`;
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

const resetUserOTP = (id, payload) => {
  return axios.post(`user/${id}/reset-mfa-otp`, payload)
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
  updateMfaSetting,
  getMfaEnforcementValidation,
  resetUserOTP
};

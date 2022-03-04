import axios from 'utils/gAdminAxios';

const getPrivacyPolicies = () => {
  return axios.get('/privacy-policy')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPrivacyPolicy = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/privacy-policy/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPublishPrivacyPolicy = () => {
  return axios.get('/user-privacy-policy')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createPrivacyPolicy = payload => {
  return axios.post('/privacy-policy', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updatePrivacyPolicy = (id, payload) => {
  return axios.put(`/privacy-policy/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const publishPrivacyPolicy = id => {
  return axios.post(`/privacy-policy/publish/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const PrivacyPolicy = {
  getPrivacyPolicies,
  getPrivacyPolicy,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  publishPrivacyPolicy,
  getPublishPrivacyPolicy
};

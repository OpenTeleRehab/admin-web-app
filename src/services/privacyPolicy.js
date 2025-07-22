import axios from 'utils/gAdminAxios';

const getPrivacyPolicies = () => {
  return axios.get('/public/privacy-policy')
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
  return axios.get(`/public/privacy-policy/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPublishPrivacyPolicy = payload => {
  return axios.get('/public/user-privacy-policy', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const privacyPolicy = {
  getPrivacyPolicies,
  getPrivacyPolicy,
  getPublishPrivacyPolicy
};

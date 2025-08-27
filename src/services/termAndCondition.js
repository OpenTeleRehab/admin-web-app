import axios from 'utils/gAdminAxios';

const getTermAndCondition = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/public/term-condition/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTermAndConditions = () => {
  return axios.get('/public/term-condition')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPublishTermConditionPage = payload => {
  return axios.get('/user-term-condition', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const termAndCondition = {
  getTermAndCondition,
  getTermAndConditions,
  getPublishTermConditionPage
};

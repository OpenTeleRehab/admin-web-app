import axios from 'utils/gAdminAxios';

const getTermAndCondition = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/term-condition/${id}` + langParam)
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
  return axios.get('/term-condition')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPublishTermConditionPage = id => {
  return axios.get('/user-term-condition')
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

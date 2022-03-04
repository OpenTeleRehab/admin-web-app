import axios from 'utils/gAdminAxios';

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

const createTermAndCondition = payload => {
  return axios.post('/term-condition', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateTermAndCondition = (id, payload) => {
  return axios.put(`/term-condition/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const publishTermAndCondition = id => {
  return axios.post(`/term-condition/publish/${id}`)
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

export const TermAndCondition = {
  getTermAndConditions,
  getTermAndCondition,
  createTermAndCondition,
  updateTermAndCondition,
  publishTermAndCondition,
  getPublishTermConditionPage
};

import axios from 'utils/axios';

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

export const termAndConditionAuth = {
  createTermAndCondition,
  updateTermAndCondition,
  publishTermAndCondition
};

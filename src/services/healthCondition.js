import axios from 'utils/axios';

const getHealthConditions = payload => {
  return axios.get('/health-condition',
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

const getHealthCondition = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';

  return axios.get(`/health-condition/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createHealthCondition = payload => {
  return axios.post('/health-condition', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateHealthCondition = (id, payload) => {
  return axios.put(`/health-condition/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteHealthCondition = id => {
  return axios.delete(`/health-condition/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const HealthCondition = {
  getHealthConditions,
  getHealthCondition,
  createHealthCondition,
  updateHealthCondition,
  deleteHealthCondition
};

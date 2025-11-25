import axios from 'utils/axios';

const getHealthConditionGroups = () => {
  return axios.get('/health-condition-group')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getHealthConditionGroup = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';

  return axios.get(`/health-condition-group/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createHealthConditionGroup = payload => {
  return axios.post('/health-condition-group', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateHealthConditionGroup = (id, payload) => {
  return axios.put(`/health-condition-group/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteHealthConditionGroup = id => {
  return axios.delete(`/health-condition-group/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const HealthConditionGroup = {
  getHealthConditionGroups,
  getHealthConditionGroup,
  createHealthConditionGroup,
  updateHealthConditionGroup,
  deleteHealthConditionGroup
};

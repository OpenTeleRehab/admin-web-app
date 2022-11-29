import axios from 'utils/axios';
import _ from 'lodash';

const getAssistiveTechnologies = payload => {
  return axios.get('/assistive-technologies', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getAssistiveTechnology = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/assistive-technologies/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createAssistiveTechnology = payload => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/assistive-technologies', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const updateAssistiveTechnology = (id, payload) => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post(`/assistive-technologies/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const deleteAssistiveTechnology = id => {
  return axios.delete(`/assistive-technologies/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const AssistiveTechnology = {
  getAssistiveTechnologies,
  getAssistiveTechnology,
  createAssistiveTechnology,
  updateAssistiveTechnology,
  deleteAssistiveTechnology
};

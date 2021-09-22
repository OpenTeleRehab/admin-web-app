import axios from 'utils/axios';
import _ from 'lodash';

const getGuidancePage = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/guidance-page/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getGuidancePages = payload => {
  return axios.get('/guidance-page', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createGuidancePage = (payload) => {
  return axios.post('/guidance-page', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateGuidancePage = (id, payload) => {
  return axios.put(`/guidance-page/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateGuidancePages = (payload) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(payload));

  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/guidance-page/update-order', formData)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteGuidancePage = (id) => {
  return axios.delete(`/guidance-page/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const guidancePage = {
  getGuidancePage,
  getGuidancePages,
  createGuidancePage,
  updateGuidancePage,
  updateGuidancePages,
  deleteGuidancePage
};

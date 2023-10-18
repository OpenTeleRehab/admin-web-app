import axios from 'utils/axios';
import _ from 'lodash';

const getStaticPage = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/static-page/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getStaticPages = payload => {
  return axios.get('/static-page', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createStaticPage = (payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/static-page', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateStaticPage = (id, payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });
  return axios.post(`/static-page/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getFaqPage = (payload) => {
  return axios.get('/page/static-page-data', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const staticPage = {
  getStaticPages,
  createStaticPage,
  updateStaticPage,
  getStaticPage,
  getFaqPage
};

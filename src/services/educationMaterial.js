import axios from 'utils/axios';
import _ from 'lodash';

const getEducationMaterial = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/education-material/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createEducationMaterial = (payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/education-material', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateEducationMaterial = (id, payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post(`/education-material/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
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

export const EducationMaterial = {
  getEducationMaterial,
  createEducationMaterial,
  updateEducationMaterial
};

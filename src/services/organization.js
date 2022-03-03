import axios from 'utils/axios';
import gAdminAxios from 'utils/gAdminAxios';

const getOrganizations = () => {
  return axios.get('/organization')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getOrganization = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/organization/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createOrganization = payload => {
  return axios.post('/organization', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateOrganization = (id, payload) => {
  return axios.post(`/organization/${id}?_method=PUT`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteOrganization = id => {
  return axios.delete(`/organization/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTherapistAndTreatmentLimit = subDomain => {
  const params = { sub_domain: subDomain };
  return gAdminAxios.get('org/org-therapist-and-treatment-limit', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Organization = {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getTherapistAndTreatmentLimit
};

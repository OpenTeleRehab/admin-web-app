import axios from 'utils/axios';

const getClinics = () => {
  return axios.get('/clinic')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createClinic = payload => {
  return axios.post('/clinic', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateClinic = (id, payload) => {
  return axios.put(`/clinic/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteClinic = id => {
  return axios.delete(`/clinic/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const countTherapistLimitByCountry = (countryId) => {
  const params = { country_id: countryId };
  return axios.get('clinic/therapist-limit/count/by-country', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const countTherapistByClinic = (clinicId) => {
  const params = { clinic_id: clinicId };
  return axios.get('clinic/therapist/count/by-clinic', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Clinic = {
  getClinics,
  createClinic,
  updateClinic,
  deleteClinic,
  countTherapistLimitByCountry,
  countTherapistByClinic
};

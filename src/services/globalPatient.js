import axios from 'utils/axios';

const getGlobalPatients = payload => {
  return axios.get('/global-patients', {
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

const deleteGlobalPatient = id => {
  return axios.delete(`/global-patients/${id}`)
    .then(
      res => {
        return res.data;
      }
    ).catch((e) => {
      return e.response.data;
    });
};

const downloadPatientRawData = (payload) => {
  return axios.get('/export', { params: { ...payload, type: 'patient_raw_data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const GlobalPatient = {
  getGlobalPatients,
  deleteGlobalPatient,
  downloadPatientRawData
};

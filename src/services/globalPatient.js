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

export const GlobalPatient = {
  getGlobalPatients
};

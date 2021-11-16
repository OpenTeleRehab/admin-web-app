import axiosInstance from '../utils/axios';

const getGlobalPatients = payload => {
  return axiosInstance.get('/global-patients', {
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

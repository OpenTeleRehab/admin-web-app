import axios from 'utils/axios';

const getCountries = () => {
  return axios.get('/country')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Country = {
  getCountries
};
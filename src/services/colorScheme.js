import axios from 'utils/axios';

const createColorScheme = (payload) => {
  return axios.post('/color-scheme', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getColorScheme = () => {
  return axios.get('/color-scheme')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const colorScheme = {
  getColorScheme,
  createColorScheme
};

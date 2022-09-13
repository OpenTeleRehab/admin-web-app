import axios from 'utils/gAdminAxios';

const getLanguage = () => {
  return axios.get('/language')
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createLanguage = payload => {
  return axios.post('/language', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateLanguage = (id, payload) => {
  return axios.put(`/language/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteLanguage = id => {
  return axios.delete(`/language/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const autoTranslateLanguage = id => {
  return axios.put(`/language/language_auto_translate/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Language = {
  getLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  autoTranslateLanguage
};

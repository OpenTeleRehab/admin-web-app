import axios from 'utils/gAdminAxios';

const getTranslations = (lang) => {
  const params = { lang: lang };

  return axios.get('/translation/i18n/admin_portal', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Translation = {
  getTranslations
};

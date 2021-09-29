import axios from 'utils/axios';
import { getCountryIsoCode } from 'utils/country';

const getDataForCountryAdmin = countryId => {
  return axios.get('chart/country-admin-dashboard', { params: countryId })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getChartDataGlobalAdmin = payload => {
  return axios.get('/chart/admin-dashboard', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getChartDataClinicAdmin = clinicId => {
  return axios.get('/chart/clinic-admin-dashboard', { params: clinicId, headers: { country: getCountryIsoCode() } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Dashboard = {
  getDataForCountryAdmin,
  getChartDataGlobalAdmin,
  getChartDataClinicAdmin
};

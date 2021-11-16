import axiosPatient from 'utils/patient-axios';
import { getCountryIsoCode } from 'utils/country';

const getTreatmentPlans = payload => {
  return axiosPatient.get('/treatment-plan', { params: payload, headers: { country: getCountryIsoCode(payload.country_id) } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTreatmentPlansDetail = payload => {
  return axiosPatient.get('/treatment-plan/get-treatment-plan-detail', { params: payload, headers: { country: getCountryIsoCode(payload.country_id) } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const TreatmentPlan = {
  getTreatmentPlans,
  getTreatmentPlansDetail
};

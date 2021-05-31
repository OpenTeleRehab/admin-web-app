import _ from 'lodash';
import store from 'store';

export const getCountryName = (id, countries) => {
  const country = _.findLast(countries, { id: parseInt(id, 10) });

  return country ? country.name : '';
};

export const getCountryIdentity = (id, countries) => {
  const country = _.findLast(countries, { id: parseInt(id, 10) });

  return country ? country.identity : '';
};

export const getCountryISO = (id, countries) => {
  const country = _.findLast(countries, { id: parseInt(id, 10) });

  return country ? country.iso_code : '';
};

export const getTotalTherapistLimit = (id, countries) => {
  const country = _.findLast(countries, { id: parseInt(id, 10) });

  return country ? country.therapist_limit : 50;
};

export const getCountryIsoCode = () => {
  const profile = store.getState().auth.profile;
  const countries = store.getState().country.countries;
  const country = countries.find(item => item.id === profile && profile.country_id);

  return country ? country.iso_code : '';
};

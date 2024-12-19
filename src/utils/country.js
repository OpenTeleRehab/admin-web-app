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

export const getCountryIsoCode = (countryId) => {
  const profile = store.getState().auth.profile;
  const countries = store.getState().country.countries;
  const country = countries.find(item => item.id === parseInt(countryId || profile.country_id));

  return country ? country.iso_code : '';
};

export const getCountryNames = (ids, countries) => {
  return _.chain(countries)
    .filter(item => ids.includes(item.id))
    .map(item => item.name)
    .join(', ')
    .value();
};

export const getLocations = (ids, locations, translate) => {
  return _.chain(locations)
    .filter(item => ids.includes(item.value))
    .map(item => translate(`common.${item.label}`))
    .join(', ')
    .value();
};

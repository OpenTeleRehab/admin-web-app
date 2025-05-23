import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getTranslations } from 'store/translation/actions';
import { getCountries } from 'store/country/actions';
import { getClinics } from 'store/clinic/actions';
import { getProfessions } from 'store/profession/actions';
import { getLanguages } from 'store/language/actions';
import { getDefaultLimitedPatients } from 'store/setting/actions';
import { getProfile } from 'store/auth/actions';
import { getOrganizations, getOrganizationTherapistAndTreatmentLimit } from './store/organization/actions';
import SplashScreen from './components/SplashScreen';
import { getColorScheme } from './store/colorScheme/actions';

const ConfigurationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      dispatch(getProfile()).then(res => {
        if (res.data) {
          dispatch(getTranslations(res.data.language_id)).then(res => {
            if (res) {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      });

      dispatch(getCountries());
      dispatch(getClinics());
      dispatch(getProfessions());
      dispatch(getLanguages());
      dispatch(getDefaultLimitedPatients());
      dispatch(getOrganizationTherapistAndTreatmentLimit(process.env.REACT_APP_NAME));
      dispatch(getColorScheme());
      dispatch(getOrganizations());
    }
  }, [loading, dispatch]);

  return loading ? <SplashScreen /> : children;
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigurationProvider;

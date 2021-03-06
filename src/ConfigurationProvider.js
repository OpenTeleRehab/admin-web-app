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
import SplashScreen from './components/SplashScreen';

const ConfigurationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      dispatch(getProfile());
      dispatch(getTranslations()).then(res => {
        if (res) {
          setLoading(false);
        }
      });

      dispatch(getCountries());
      dispatch(getClinics());
      dispatch(getProfessions());
      dispatch(getLanguages());
      dispatch(getDefaultLimitedPatients());
    }
  }, [loading, dispatch]);

  return loading ? <SplashScreen /> : children;
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigurationProvider;

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
import { useRole } from 'hooks/useRole';
import { USER_ROLES } from 'variables/user';

const ConfigurationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { hasAnyRole } = useRole();
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

      if (hasAnyRole([USER_ROLES.MANAGE_CLINIC, USER_ROLES.VIEW_CLINIC_LIST])) {
        dispatch(getClinics());
      }

      if (hasAnyRole([USER_ROLES.MANAGE_PROFESSION, USER_ROLES.VIEW_PROFESSION])) {
        dispatch(getProfessions());
      }

      dispatch(getLanguages());
      dispatch(getDefaultLimitedPatients());
      if (hasAnyRole([USER_ROLES.MANAGE_ORGANIZATION, USER_ROLES.VIEW_MANAGE_ORGANIZATION])) {
        dispatch(getOrganizationTherapistAndTreatmentLimit(process.env.REACT_APP_NAME));
        dispatch(getOrganizations());
      }
      dispatch(getColorScheme());
    }
  }, [loading, dispatch]);

  return loading ? <SplashScreen /> : children;
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigurationProvider;

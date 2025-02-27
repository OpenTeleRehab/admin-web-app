import React, { useState, useEffect } from 'react';
import ClinicAdminDashbaord from 'views/Superset/ClinicAdmin';
import GlobalAdminDashboard from 'views/Superset/GlobalAdmin';
import CountryAdminDashboard from 'views/Superset/CountryAdmin';
import PropTypes from 'prop-types';
import { USER_GROUPS } from 'variables/user';
import { useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';

const SupersetDashboard = () => {
  const { profile } = useSelector(state => state.auth);
  const { keycloak } = useKeycloak();
  const [viewClinicDashboard, setViewClinicDashboard] = useState(false);
  const [viewCountryDashboard, setViewCountryDashboard] = useState(false);
  const [viewGlobalDashboard, setViewGlobalDashboard] = useState(false);

  useEffect(() => {
    if (profile !== undefined) {
      if (profile.type === USER_GROUPS.CLINIC_ADMIN) {
        setViewClinicDashboard(true);
      } else if (profile.type === USER_GROUPS.COUNTRY_ADMIN) {
        setViewCountryDashboard(true);
      } else {
        setViewGlobalDashboard(true);
      }
    }
  }, [profile, keycloak]);

  return (
    <>
      { viewGlobalDashboard && <GlobalAdminDashboard /> }
      { viewCountryDashboard && <CountryAdminDashboard /> }
      { viewClinicDashboard && <ClinicAdminDashbaord /> }
    </>
  );
};

SupersetDashboard.propTypes = {
  translate: PropTypes.func
};

export default SupersetDashboard;

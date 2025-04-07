import React, { useState, useEffect } from 'react';
import { USER_GROUPS } from 'variables/user';
import { useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import SupersetDashboard from 'components/SupersetDashboard';

const Dashboard = () => {
  const { profile } = useSelector(state => state.auth);
  const { keycloak } = useKeycloak();
  const [dashboardId, setDashboardId] = useState(null);

  useEffect(() => {
    if (profile !== undefined) {
      if (profile.type === USER_GROUPS.CLINIC_ADMIN) {
        setDashboardId(process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_CLINIC_ADMIN);
      } else if (profile.type === USER_GROUPS.COUNTRY_ADMIN) {
        setDashboardId(process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_COUNTRY_ADMIN);
      } else {
        setDashboardId(process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_GLOBAL_ADMIN);
      }
    }
  }, [profile, keycloak]);

  if (profile === undefined || dashboardId === null) {
    return;
  }

  return (
    <>
      <SupersetDashboard dashboardId={dashboardId} />
    </>
  );
};

export default Dashboard;

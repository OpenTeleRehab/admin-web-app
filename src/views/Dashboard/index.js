import React, { useState, useEffect } from 'react';
import { USER_GROUPS } from 'variables/user';
import { useDispatch, useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import SupersetDashboard from 'components/SupersetDashboard';
import _ from 'lodash';
import customColorScheme from '../../utils/customColorScheme';
import { Button } from 'react-bootstrap';
import { downloadQuestionnaireResults } from '../../store/questionnaire/actions';
import { updateDownloadPending } from '../../store/downloadTracker/actions';
import { getTranslate } from 'react-localize-redux';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { keycloak } = useKeycloak();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
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

  const handleDownloadQuestionnaireResults = () => {
    dispatch(downloadQuestionnaireResults(profile.language_id, profile.country_id))
      .then(res => {
        dispatch(updateDownloadPending([res]));
      });
  };

  return (
    <>
      <Button className="float-right mb-3" variant="primary" onClick={handleDownloadQuestionnaireResults}>
        {translate('questionnaire.download_report')}
      </Button>
      <SupersetDashboard dashboardId={dashboardId} />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default Dashboard;

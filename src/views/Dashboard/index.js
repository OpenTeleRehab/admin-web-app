import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  if (profile === undefined) {
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
      <SupersetDashboard />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default Dashboard;

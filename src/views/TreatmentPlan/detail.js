import React, { useState, useEffect } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
  Button, OverlayTrigger,
  Tab,
  Tabs, Tooltip
} from 'react-bootstrap';
import moment from 'moment/moment';
import * as ROUTES from 'variables/routes';

import { getTreatmentPlansDetail } from '../../store/treatmentPlan/actions';
import settings from 'settings';
import { TAB } from 'variables/treatmentPlan';
import QuestionnaireTab from './TabContents/questionnaireTab';

import AdherenceTab from './TabContents/adherenceTab';
import _ from 'lodash';
import { renderStatusBadge } from '../../utils/treatmentPlan';
import GoalTrackingTab from './TabContents/goalTrakingTab';
import EllipsisText from 'react-ellipsis-text';
import ActivitySection from './_Partials/activitySection';

const ViewTreatmentPlan = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const treatmentPlansDetail = useSelector((state) => state.treatmentPlan.treatmentPlansDetail);
  const { id, patientId, countryId } = useParams();
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    patient_id: patientId,
    start_date: '',
    end_date: '',
    patient_name: '',
    status: ''
  });
  const [weeks, setWeeks] = useState(1);
  const [key, setKey] = useState(TAB.activities);
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    removeTabIndexAttr();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getTreatmentPlansDetail({ id, lang: profile && profile.language_id, therapist_id: profile && profile.id, country_id: countryId }));
    }
  }, [id, patientId, dispatch, profile, countryId]);

  useEffect(() => {
    if (id && !_.isEmpty(treatmentPlansDetail)) {
      setFormFields({
        name: treatmentPlansDetail.name,
        description: treatmentPlansDetail.description,
        patient_id: treatmentPlansDetail.patient_id,
        start_date: moment(treatmentPlansDetail.start_date, settings.date_format).format(settings.date_format),
        end_date: moment(treatmentPlansDetail.end_date, settings.date_format).format(settings.date_format),
        status: treatmentPlansDetail.status
      });
      setWeeks(treatmentPlansDetail.total_of_weeks);
      setActivities(treatmentPlansDetail.activities);
      setStartDate(moment(treatmentPlansDetail.start_date, settings.date_format).format(settings.date_format));
    }
    // eslint-disable-next-line
  }, [id, treatmentPlansDetail]);

  const handleSelectTab = (key) => {
    setKey(key);
    removeTabIndexAttr();
  };

  const removeTabIndexAttr = () => {
    setTimeout(() => {
      document.getElementById('controlled-tab-tab-activities').removeAttribute('tabindex');
      document.getElementById('controlled-tab-tab-adherence').removeAttribute('tabindex');
      document.getElementById('controlled-tab-tab-questionnaires').removeAttribute('tabindex');
      document.getElementById('controlled-tab-tab-goal_tracking').removeAttribute('tabindex');
    }, 100);
  };

  return (
    <>
      <div>
        <div className="d-flex align-self-center">
          <h4>{formFields.name}</h4>
          <span className="mb-2 ml-3">
            {renderStatusBadge(treatmentPlansDetail)}
          </span>
          <Button
            className="ml-auto"
            variant="outline-primary"
            as={Link}
            to={ROUTES.VIEW_PATIENT_DETAIL.replace(':patientId', patientId).replace(':countryId', countryId)}
          >
            &lt; {translate('treatment_plan.back_to_list')}
          </Button>
        </div>
        <div className="patient-info">
          <span className="mr-4">
            <strong>{translate('common.description')}:</strong>&nbsp;
            {formFields.description && (
              <OverlayTrigger
                overlay={<Tooltip id="button-tooltip-2">{ formFields.description }</Tooltip>}
              >
                <span className="card-title">
                  <EllipsisText text={formFields.description} length={settings.noteMaxLength} />
                </span>
              </OverlayTrigger>
            )}
          </span>
          <span className="mr-4"><strong>{translate('common.start_date')}:</strong> {formFields.start_date}</span>
          <span className="mr-4"><strong>{translate('common.end_date')}:</strong> {formFields.end_date}</span>
        </div>
      </div>
      <div className="mt-lg-5">
        <Tabs
          id="controlled-tab"
          activeKey={key}
          onSelect={(key) => handleSelectTab(key)}
        >
          <Tab eventKey={TAB.activities} title={translate('treatment_plan.activities_tab')}>
            <ActivitySection weeks={weeks} startDate={startDate} activities={activities} />
          </Tab>
          {patientId &&
            <Tab eventKey={TAB.adherence} title={translate('treatment_plan.adherence_tab')}>
              <AdherenceTab activities={activities} startDate={treatmentPlansDetail.start_date} endDate={treatmentPlansDetail.end_date}/>
            </Tab>
          }
          {patientId &&
            <Tab eventKey={TAB.questionnaires} title={translate('treatment_plan.questionnaires_tab')}>
              <QuestionnaireTab activities={activities}/>
            </Tab>
          }
          {patientId &&
            <Tab eventKey={TAB.goal_tracking} title={translate('treatment_plan.goal_tracking_tab')}>
              <GoalTrackingTab activities={activities}/>
            </Tab>
          }
        </Tabs>
      </div>
    </>
  );
};

export default ViewTreatmentPlan;

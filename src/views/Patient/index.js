import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Tab, Tabs } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import PatientList from './Partials/patientList';
import PatientReferral from './Partials/patientReferral';
import AssistiveTechnologyPatient from 'components/AssistiveTechnologyPatient';
import { useDispatch, useSelector } from 'react-redux';
import { downloadPatientRawData } from 'store/globalPatient/actions';
import { updateDownloadPending } from 'store/downloadTracker/actions';
import { PATIENT } from 'variables/routes';
import { FaDownload } from 'react-icons/fa';
import { useOne } from 'hooks/useOne';
import { END_POINTS } from 'variables/endPoint';
import { useKeycloak } from '@react-keycloak/web';
import { USER_ROLES } from 'variables/user';

const VIEW_PATIENT = 'patientList';
const VIEW_PATIENT_REFERRAL = 'patientReferralList';
const ASSISTIVE_TECHNOLOGY = 'atList';

const Patient = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const { search } = useLocation();

  const { profile } = useSelector(state => state.auth);
  const { languages } = useSelector(state => state.language);
  const [type, setType] = useState('patientList');
  const [downloadFilter, setDownloadfilter] = useState();
  const { data: referralCount } = useOne(END_POINTS.PATIENT_REFERRAL, 'count');

  useEffect(() => {
    if (queryString.parse(search).tab === ASSISTIVE_TECHNOLOGY) {
      setType(ASSISTIVE_TECHNOLOGY);
    } else if (queryString.parse(search).tab === VIEW_PATIENT_REFERRAL) {
      setType(VIEW_PATIENT_REFERRAL);
    } else {
      setType(VIEW_PATIENT);
    }
  }, [search]);

  const handleSelectTab = (key) => {
    history.push(`${PATIENT}?tab=${key}`);
    setType(key);
  };

  const handleDownload = () => {
    dispatch(downloadPatientRawData({ lang: profile.language_id ? profile.language_id : languages.lenght ? languages[0].id : '', ...downloadFilter }))
      .then(res => {
        dispatch(updateDownloadPending([res]));
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('patient.list')}</h1>
        {type === 'patientList' && (
          <Button onClick={handleDownload}>
            <FaDownload size={14} className="mr-1"/>
            {translate('common.download')}
          </Button>
        )}
      </div>
      <Tabs id="amg-tab" activeKey={type} onSelect={(key) => handleSelectTab(key)} transition={false}>
        <Tab eventKey="patientList" title={translate('patient')}>
          <PatientList translate={translate} setDownloadfilter={setDownloadfilter}/>
        </Tab>

        {keycloak.hasRealmRole(USER_ROLES.MANAGE_PATIENT_REFERRAL) && (
          <Tab eventKey="patientReferralList" title={<div>{translate('patient.referral.list')} <Badge className="ml-1" variant="danger">{referralCount ?? 0}</Badge></div>}>
            <PatientReferral translate={translate} setDownloadfilter={setDownloadfilter}/>
          </Tab>
        )}

        <Tab eventKey="atList" title={translate('assistive_technology')}>
          <AssistiveTechnologyPatient translate={translate} />
        </Tab>
      </Tabs>
    </>
  );
};

Patient.propTypes = {
  translate: PropTypes.func
};

export default Patient;

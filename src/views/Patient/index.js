import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Button } from 'react-bootstrap';
import PatientList from './Partials/patientList';
import AssistiveTechnologyPatient from 'components/AssistiveTechnologyPatient';
import { useDispatch, useSelector } from 'react-redux';
import { downloadPatientRawData } from 'store/globalPatient/actions';
import { FaDownload } from 'react-icons/fa';

const Patient = ({ translate }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);
  const { languages } = useSelector(state => state.language);
  const [type, setType] = useState('patientList');
  const [downloadFilter, setDownloadfilter] = useState();
  const handleSelectTab = (key) => {
    setType(key);
  };

  const handleDownload = () => {
    dispatch(downloadPatientRawData({ lang: profile.language_id ? profile.language_id : languages.lenght ? languages[0].id : '', ...downloadFilter }));
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

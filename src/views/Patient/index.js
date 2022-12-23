import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import PatientList from './Partials/patientList';
import AssistiveTechnologyPatient from 'components/AssistiveTechnologyPatient';

const Patient = ({ translate }) => {
  const [type, setType] = useState('patientList');
  const handleSelectTab = (key) => {
    setType(key);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('patient.list')}</h1>
      </div>
      <Tabs id="amg-tab" activeKey={type} onSelect={(key) => handleSelectTab(key)} transition={false}>
        <Tab eventKey="patientList" title={translate('patient')}>
          <PatientList translate={translate} />
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

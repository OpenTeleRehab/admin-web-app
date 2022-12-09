import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import PatientList from './Partials/patientList';
import AssistiveList from './Partials/assistiveList';
import { useSelector } from 'react-redux';
import { USER_GROUPS } from '../../variables/user';

const Patient = ({ translate }) => {
  const { profile } = useSelector(state => state.auth);
  const [type, setType] = useState('patientList');
  const handleSelectTab = (key) => {
    setType(key);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('patient.list')}</h1>
      </div>
      {profile.type === USER_GROUPS.ORGANIZATION_ADMIN ? (
        <Tabs id="amg-tab" activeKey={type} onSelect={(key) => handleSelectTab(key)} transition={false}>
          <Tab eventKey="patientList" title={translate('patient')}>
            <PatientList translate={translate} />
          </Tab>
          <Tab eventKey="atList" title={translate('assistive_technology')}>
            <AssistiveList translate={translate} />
          </Tab>
        </Tabs>
      ) : (
        <PatientList translate={translate} />
      )}
    </>
  );
};

Patient.propTypes = {
  translate: PropTypes.func
};

export default Patient;

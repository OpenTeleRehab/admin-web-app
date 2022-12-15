import React from 'react';
import {
  Template,
  TemplatePlaceholder,
  Plugin
} from '@devexpress/dx-react-core';
import PropTypes from 'prop-types';

const TotalPatientPanel = ({ translate, totalCount }) => (
  <Plugin>
    <Template name="toolbarContent">
      <TemplatePlaceholder />
      <span className="ml-2 mt-2">{translate('assistive_patient.total_patient', { number: totalCount })}</span>
    </Template>
  </Plugin>
);

TotalPatientPanel.propTypes = {
  translate: PropTypes.func.isRequired,
  totalCount: PropTypes.number
};

export default TotalPatientPanel;

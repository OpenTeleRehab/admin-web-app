import React from 'react';
import PropTypes from 'prop-types';

import { TableFilterRow } from '@devexpress/dx-react-grid-bootstrap4';
import StatusFilterCell from 'components/Table/FilterCells/StatusFilterCell';
import DateRangeFilterCell from 'components/Table/FilterCells/DateRangeFilterCell';
import CountryFilterCell from 'components/Table/FilterCells/CountryFilterCell';
import ClinicFilterCell from 'components/Table/FilterCells/ClinicFilterCell';
import ProfessionFilterCell from 'components/Table/FilterCells/ProfessionFilterCell';
import TreatmentStatusFilterCell from 'components/Table/FilterCells/TreatmentStatusFilterCell';
import NumberFilterCell from './NumberFilterCell';
import GenderFilterCell from './GenderFilterCell';
import AssistiveTechnologyFilterCell from './AssistiveTechnologyFilterCell';

const FilterCell = (props) => {
  const { column } = props;
  if (column.name === 'status') {
    return <StatusFilterCell {...props} />;
  } else if (column.name === 'treatment_status') {
    return <TreatmentStatusFilterCell {...props} />;
  } else if (column.name === 'last_login') {
    return <DateRangeFilterCell {...props} />;
  } else if (column.name === 'action' ||
    column.name === 'next_appointment' || column.name === 'treatment_plan' ||
    column.name === 'treatment_status' || column.name === 'region' ||
    column.name === 'storage_used' || column.name === 'on_going_treatment' ||
    column.name === 'total_patient' || column.name === 'assigned_patient') {
    return <th className="dx-g-bs4-fixed-cell position-sticky" style={{ right: 0 }} />;
  } else if (column.name === 'therapist_country') {
    return <CountryFilterCell {...props} />;
  } else if (column.name === 'therapist_clinic') {
    return <ClinicFilterCell {...props} />;
  } else if (column.name === 'date_of_birth' || column.name === 'start_date' || column.name === 'end_date' || column.name === 'provision_date') {
    return <DateRangeFilterCell {...props} />;
  } else if (column.name === 'country') {
    return <CountryFilterCell {...props} />;
  } else if (column.name === 'clinic') {
    return <ClinicFilterCell {...props} />;
  } else if (column.name === 'profession') {
    return <ProfessionFilterCell {...props} />;
  } else if (column.name === 'age' || column.name === 'limit_patient') {
    return <NumberFilterCell {...props} />;
  } else if (column.name === 'gender') {
    return <GenderFilterCell {...props} />;
  } else if (column.name === 'assistive_technology') {
    return <AssistiveTechnologyFilterCell {...props} />;
  }
  return <TableFilterRow.Cell {...props} />;
};

FilterCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired
};

export default FilterCell;

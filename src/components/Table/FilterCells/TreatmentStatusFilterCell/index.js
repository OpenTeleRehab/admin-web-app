import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';
import { STATUS } from 'variables/treatmentPlan';

const StatusFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [status, setStatus] = useState('');

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  const treatmentStatusData = [
    {
      value: '',
      name: translate('common.all')
    },
    {
      value: 1,
      name: translate(`common.${STATUS.finished}`)
    },
    {
      value: 2,
      name: translate(`common.${STATUS.planned}`)
    },
    {
      value: 3,
      name: translate(`common.${STATUS.on_going}`)
    }
  ];

  const handleFilter = (value) => {
    setStatus(value);
    onFilter(value === '' ? null : { value });
  };

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={treatmentStatusData.filter(item => item.value === status) }
        getOptionLabel={option => option.name}
        options={treatmentStatusData}
        onChange={(e) => handleFilter(e.value)}
        styles={customSelectStyles}
      />
    </th>
  );
};

StatusFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default StatusFilterCell;

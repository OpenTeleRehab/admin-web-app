import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';

const ReferralStatusFilterCell = ({ filter, onFilter }) => {
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
    }),
    menuPortal: base => ({ ...base, zIndex: 1000 })
  };
  const statusData = [
    {
      value: '',
      name: translate('common.all')
    },
    {
      value: 'declined',
      name: translate('common.declined')
    },
    {
      value: 'invited',
      name: translate('common.invited')
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
        value={statusData.filter(item => item.value === status)}
        getOptionLabel={option => option.name}
        options={statusData}
        onChange={(e) => handleFilter(e.value)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Referral status"
      />
    </th>
  );
};

ReferralStatusFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default ReferralStatusFilterCell;

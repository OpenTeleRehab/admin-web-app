import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';

const UserGroupFilterCell = ({ filter, onFilter }) => {
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
  const userGroupData = [
    {
      value: '',
      name: translate('common.all')
    },
    {
      value: 'super_admin',
      name: translate('common.super_admin')
    },
    {
      value: 'organization_admin',
      name: translate('common.organization_admin')
    },
    {
      value: 'country_admin',
      name: translate('common.country_admin')
    },
    {
      value: 'clinic_admin',
      name: translate('common.clinic_admin')
    },
    {
      value: 'therapist',
      name: translate('common.therapist')
    },
    {
      value: 'patient',
      name: translate('common.patient')
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
        value={userGroupData.filter(item => item.value === status)}
        getOptionLabel={option => option.name}
        options={userGroupData}
        onChange={(e) => handleFilter(e.value)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Status"
      />
    </th>
  );
};

UserGroupFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default UserGroupFilterCell;

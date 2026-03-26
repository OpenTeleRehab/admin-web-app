import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';
import { USER_GROUPS } from 'variables/user';

const UserGroupFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector(state => state.auth);
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
  const allGroups = [
    {
      value: '',
      name: translate('common.all')
    },
    {
      value: USER_GROUPS.ORGANIZATION_ADMIN,
      name: translate('common.organization_admin')
    },
    {
      value: USER_GROUPS.COUNTRY_ADMIN,
      name: translate('common.country_admin')
    },
    {
      value: USER_GROUPS.REGIONAL_ADMIN,
      name: translate('common.regional_admin')
    },
    {
      value: USER_GROUPS.CLINIC_ADMIN,
      name: translate('common.clinic_admin')
    },
    {
      value: USER_GROUPS.PHC_SERVICE_ADMIN,
      name: translate('common.phc_service_admin')
    },
    {
      value: USER_GROUPS.THERAPIST,
      name: translate('common.therapist')
    },
    {
      value: USER_GROUPS.PHC_WORKER,
      name: translate('common.phc_worker')
    },
    {
      value: USER_GROUPS.PATIENT,
      name: translate('common.patient')
    }
  ];

  const hideByUser = {
    [USER_GROUPS.COUNTRY_ADMIN]: [USER_GROUPS.ORGANIZATION_ADMIN],
    [USER_GROUPS.REGIONAL_ADMIN]: [USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.COUNTRY_ADMIN],
    [USER_GROUPS.CLINIC_ADMIN]: [USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.REGIONAL_ADMIN, USER_GROUPS.PHC_SERVICE_ADMIN, USER_GROUPS.PHC_WORKER],
    [USER_GROUPS.PHC_SERVICE_ADMIN]: [USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.REGIONAL_ADMIN, USER_GROUPS.CLINIC_ADMIN, USER_GROUPS.THERAPIST],
  };

  const userGroupData = allGroups.filter(option => !(hideByUser[profile.type] || []).includes(option.value));

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

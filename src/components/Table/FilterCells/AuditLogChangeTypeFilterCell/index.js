import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';

const AuditLogChangeTypeFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [changeType, setChangeType] = useState('');

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
  const changeTypeData = [
    {
      value: '',
      name: translate('common.all')
    },
    {
      value: 'login',
      name: translate('common.login')
    },
    {
      value: 'logout',
      name: translate('common.logout')
    },
    {
      value: 'created',
      name: translate('common.created')
    },
    {
      value: 'updated',
      name: translate('common.updated')
    },
    {
      value: 'deleted',
      name: translate('common.deleted')
    }
  ];

  const handleFilter = (value) => {
    setChangeType(value);
    onFilter(value === '' ? null : { value });
  };

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={changeTypeData.filter(item => item.value === changeType)}
        getOptionLabel={option => option.name}
        options={changeTypeData}
        onChange={(e) => handleFilter(e.value)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Change type"
      />
    </th>
  );
};

AuditLogChangeTypeFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default AuditLogChangeTypeFilterCell;

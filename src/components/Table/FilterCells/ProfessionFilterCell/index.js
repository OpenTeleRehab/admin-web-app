import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';

const ProfessionFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const professions = useSelector(state => state.profession.professions);
  const translate = getTranslate(localize);
  const [profession, setProfession] = useState('');

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

  const handleFilter = (value) => {
    setProfession(value);
    onFilter(value === '' ? null : { value });
  };
  const optionData = [
    {
      id: '',
      name: translate('common.all')
    },
    ...professions
  ];
  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={optionData.filter(item => item.id === profession)}
        getOptionLabel={option => option.name}
        options={optionData}
        onChange={(e) => handleFilter(e.id)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Profession"
      />
    </th>
  );
};

ProfessionFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default ProfessionFilterCell;

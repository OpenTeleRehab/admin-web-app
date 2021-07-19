import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import scssColors from '../../../../scss/custom.scss';
import Select from 'react-select';

const CountryFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const countries = useSelector(state => state.country.countries);
  const translate = getTranslate(localize);
  const [country, setCountry] = useState('');

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
    setCountry(value);
    onFilter(value === '' ? null : { value });
  };
  const optionData = [
    {
      id: '',
      name: translate('common.all')
    },
    ...countries
  ];

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={optionData.filter(item => item.id === country)}
        getOptionLabel={option => option.name}
        options={optionData}
        onChange={(e) => handleFilter(e.id)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Country"
      />
    </th>
  );
};

CountryFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default CountryFilterCell;

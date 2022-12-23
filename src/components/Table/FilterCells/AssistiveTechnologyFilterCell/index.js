import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import scssColors from '../../../../scss/custom.scss';
import Select from 'react-select';
import _ from 'lodash';

const AssistiveTechnologyFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const { assistiveTechnologies } = useSelector(state => state.assistiveTechnology);
  const translate = getTranslate(localize);
  const [assistive, setAssistive] = useState('');
  const [optionData, setOptionData] = useState([]);

  useEffect(() => {
    const options = [];
    _.forEach(assistiveTechnologies, function (assistive) {
      options.push({ value: assistive.id, label: assistive.name });
    });
    setOptionData(options);
  }, [assistiveTechnologies]);

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

  const handleFilter = (selectedOptions) => {
    const value = _.map(selectedOptions, 'value');
    setAssistive(selectedOptions);
    onFilter(value.length === 0 ? null : { value });
  };

  return (
    <th>
      <Select
        classNamePrefix="filter"
        placeholder={translate('assistive_patient.assistive_technology.placeholder')}
        value={assistive}
        options={optionData}
        onChange={handleFilter}
        menuPortalTarget={document.body}
        isMulti
        styles={customSelectStyles}
        aria-label="assistive"
      />
    </th>
  );
};

AssistiveTechnologyFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default AssistiveTechnologyFilterCell;

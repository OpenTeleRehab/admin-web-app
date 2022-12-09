import React from 'react';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import scssColors from '../../../scss/custom.scss';
import Select from 'react-select';
import { Plugin, Template, TemplatePlaceholder } from '@devexpress/dx-react-core';
import PropTypes from 'prop-types';

const ClinicFilterPanel = ({ clinic, setClinic }) => {
  const localize = useSelector((state) => state.localize);
  const { clinics } = useSelector(state => state.clinic);
  const translate = getTranslate(localize);

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
    setClinic(value);
  };
  const optionData = [
    {
      id: '',
      name: translate('common.all')
    },
    ...clinics
  ];

  return (
    <Plugin>
      <Template name="toolbarContent">
        <TemplatePlaceholder/>
        <div className="ml-2 countryFilterToolbar">
          <Select
            classNamePrefix="filter"
            value={optionData.filter(item => item.id === clinic)}
            getOptionLabel={option => option.name}
            options={optionData}
            onChange={(e) => handleFilter(e.id)}
            menuPortalTarget={document.body}
            styles={customSelectStyles}
            aria-label="Clinic"
          />
        </div>
      </Template>
    </Plugin>
  );
};

ClinicFilterPanel.propTypes = {
  setClinic: PropTypes.func,
  clinic: PropTypes.string
};

export default ClinicFilterPanel;

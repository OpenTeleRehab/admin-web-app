import React, { useEffect, useState } from 'react';
import { getTranslate } from 'react-localize-redux';
import AuditLogList from './_Partials/AuditLogList';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import customColorScheme from '../../utils/customColorScheme';
import settings from 'settings';
import Select from 'react-select';
import scssColors from 'scss/custom.scss';
import { PLATFORMS } from '../../variables/platform';
import { USER_GROUPS } from '../../variables/user';
import { useInvalidate } from 'hooks/useInvalidate';
import { END_POINTS } from 'variables/endPoint';

const AuditLog = () => {
  const localize = useSelector((state) => state.localize);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const { countries } = useSelector(state => state.country);
  const { profile } = useSelector(state => state.auth);
  const translate = getTranslate(localize);
  const invalidate = useInvalidate();
  const [filterPlatform, setFilterPlatform] = useState(settings.platforms.options[0].value);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight,
      }
    })
  };

  useEffect(() => {
    if (countries.length > 0 && filterPlatform === PLATFORMS.PATIENT_APP) {
      setSelectedCountry(profile.country_id ?? countries[0].id);
    }
  }, [countries, filterPlatform, profile.country_id]);

  const handlePlatformChange = (e) => {
    setFilterPlatform(e.value);
    invalidate([END_POINTS.AUDIT_LOG, END_POINTS.THERAPIST_AUDIT_LOG, END_POINTS.PATIENT_AUDIT_LOG]);
  };

  return (
    <div className="mt-3">
      <h1>{translate('audit_logs')}</h1>
      <div className='d-flex'>
        <div className="mb-3 col-md-3 p-0">
          <Select
            classNamePrefix="filter"
            value={settings.platforms.options.filter(option => option.value === filterPlatform)}
            getOptionLabel={option => option.text}
            options={settings.platforms.options}
            onChange={handlePlatformChange}
            styles={customSelectStyles}
            aria-label="Platform"
          />
        </div>
        {filterPlatform === PLATFORMS.PATIENT_APP && profile.type === USER_GROUPS.ORGANIZATION_ADMIN && (
          <div className="mb-3 col-md-2 p-0 ml-2">
            <Select
              classNamePrefix="filter"
              value={countries.filter(option => option.id === selectedCountry)}
              getOptionLabel={option => option.name}
              options={countries}
              onChange={(value) => setSelectedCountry(value.id)}
              styles={customSelectStyles}
              aria-label="Country"
            />
          </div>
        )}
      </div>
      <AuditLogList translate={translate} platform={filterPlatform} countryId={selectedCountry} />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

export default AuditLog;

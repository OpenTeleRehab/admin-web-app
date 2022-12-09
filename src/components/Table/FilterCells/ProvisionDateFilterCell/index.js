import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime';

import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import settings from 'settings';
import moment from 'moment/moment';

const ProvisionDateFilterCell = ({ filter, onFilter }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [provisionDate, setProvisionDate] = useState('');

  const validateDate = (current) => {
    return current.isBefore(moment());
  };

  const handleApply = (event) => {
    setProvisionDate(event);
    if (typeof event === 'object') {
      onFilter({ value: event.format(settings.date_format) });
    }
    if (typeof event === 'string') {
      setProvisionDate('');
      onFilter(null);
    }
  };

  return (
    <th>
      <Datetime
        inputProps={{
          name: 'date',
          autoComplete: 'off',
          className: 'form-control',
          placeholder: translate('placeholder.date'),
          title: 'provision date'
        }}
        dateFormat={settings.date_format}
        timeFormat={false}
        closeOnSelect={true}
        value={provisionDate}
        onChange={handleApply}
        isValidDate={validateDate}
      />
    </th>
  );
};

ProvisionDateFilterCell.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }),
  onFilter: PropTypes.func.isRequired
};

export default ProvisionDateFilterCell;

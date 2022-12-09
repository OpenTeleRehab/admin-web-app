import React from 'react';
import settings from '../../../settings';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime';
import { Plugin, Template, TemplatePlaceholder } from '@devexpress/dx-react-core';
import { Row, Col } from 'react-bootstrap';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
const DateFilterPanel = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const handleFromDateChange = (event) => {
    if (typeof event === 'string') {
      setFromDate('');
    } else {
      setFromDate(event.format(settings.date_format));
    }
  };

  const handleToDateChange = (event) => {
    if (typeof event === 'string') {
      setToDate('');
    } else {
      setToDate(event.format(settings.date_format));
    }
  };

  return (
    <Plugin>
      <Template name="toolbarContent">
        <TemplatePlaceholder/>
        <Row className="ml-1">
          <Col>
            <span>
              <Datetime
                inputProps={{
                  name: 'fromDate',
                  autoComplete: 'off',
                  className: 'form-control',
                  placeholder: translate('assistive_patient.placeholder.from_date')
                }}
                dateFormat={settings.date_format}
                timeFormat={false}
                closeOnSelect={true}
                value={fromDate}
                onChange={handleFromDateChange}
              />
            </span>
          </Col>
          <Col>
            <Datetime
              inputProps={{
                name: 'toDate',
                autoComplete: 'off',
                className: 'form-control',
                placeholder: translate('assistive_patient.placeholder.to_date')
              }}
              dateFormat={settings.date_format}
              timeFormat={false}
              closeOnSelect={true}
              value={toDate}
              onChange={handleToDateChange}
            />
          </Col>
        </Row>
      </Template>
    </Plugin>
  );
};

DateFilterPanel.propTypes = {
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  setFromDate: PropTypes.func,
  setToDate: PropTypes.func
};

export default DateFilterPanel;

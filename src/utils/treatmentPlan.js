import React from 'react';
import { STATUS, STATUS_VARIANTS } from 'variables/treatmentPlan';
import { Badge } from 'react-bootstrap';
import moment from 'moment';
import settings from '../settings';
import { Translate } from 'react-localize-redux';

export const renderStatusBadge = (treatmentPlan) => {
  if (!treatmentPlan) {
    return '';
  }

  const today = moment().startOf('day');
  const start = moment(treatmentPlan.start_date, settings.date_format);
  const end = moment(treatmentPlan.end_date, settings.date_format);
  let status = '';
  if (start.isSameOrBefore(today) && end.isSameOrAfter(today)) {
    status = STATUS.on_going;
  } else if (start.isAfter(today)) {
    status = STATUS.planned;
  } else if (end.isBefore(today)) {
    status = STATUS.finished;
  }

  return (
    <Badge pill variant={STATUS_VARIANTS[status]}>
      <Translate id={`common.${status}`} />
    </Badge>
  );
};

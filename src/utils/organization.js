import React from 'react';
import { STATUS_VARIANTS } from 'variables/organization';
import { Badge } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';

export const renderStatusBadge = (status) => {
  return (
    <Badge pill variant={STATUS_VARIANTS[status]}>
      <Translate id={`common.${status}`} />
    </Badge>
  );
};

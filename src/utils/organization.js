import React from 'react';
import { STATUS_VARIANTS } from 'variables/organization';
import { Badge } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

export const renderStatusBadge = (status) => {
  return (
    <Badge pill variant={STATUS_VARIANTS[status]}>
      <Translate id={`common.${status}`} />
    </Badge>
  );
};

export const getOrganizationNames = (ids, organizations) => {
  return _.chain(organizations)
    .filter(item => ids.includes(item.id))
    .map(item => item.name)
    .join(', ')
    .value();
};

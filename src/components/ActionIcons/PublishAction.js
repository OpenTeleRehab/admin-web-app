import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaFileUpload } from 'react-icons/fa';

export const PublishAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.publish" /></Tooltip>}
  >
    <Button aria-label="Publish" variant="link" className={`text-success p-0 ${className}`} {...rest}>
      <FaFileUpload size={20} />
    </Button>
  </OverlayTrigger>
);

PublishAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};

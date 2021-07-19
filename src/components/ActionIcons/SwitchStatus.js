import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';

export const DisabledAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.enabled" /></Tooltip>}
  >
    <Button aria-label="Enabled" variant="link" className={`text-success p-0 ${className}`} {...rest}>
      <FaToggleOff size={20} />
    </Button>
  </OverlayTrigger>
);

DisabledAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};

export const EnabledAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.disabled" /></Tooltip>}
  >
    <Button aria-label="Disabled" variant="link" className={`text-success p-0 ${className}`} {...rest}>
      <FaToggleOn size={20} />
    </Button>
  </OverlayTrigger>
);

EnabledAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};

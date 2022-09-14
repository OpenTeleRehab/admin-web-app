import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaLanguage } from 'react-icons/fa';

export const TranslateAction = ({ className, tooltip, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id={tooltip || 'common.auto_translate'} /></Tooltip>}
  >
    <Button aria-label="Auto translate" variant="link" className={`text-success p-0 ${className}`} {...rest}>
      <FaLanguage size={30} />
    </Button>
  </OverlayTrigger>
);

TranslateAction.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.string,
  rest: PropTypes.any
};

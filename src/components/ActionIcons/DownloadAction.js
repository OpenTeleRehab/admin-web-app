import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

export const DownloadAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.download" /></Tooltip>}
  >
    <Button aria-label="Download" variant="link" className={`text-success p-0 ${className}`} {...rest}>
      <FaDownload size={20} />
    </Button>
  </OverlayTrigger>
);

DownloadAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};

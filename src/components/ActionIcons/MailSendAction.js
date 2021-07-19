import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { BiMailSend } from 'react-icons/bi';

export const MailSendAction = ({ className, ...rest }) => (
  <OverlayTrigger
    overlay={<Tooltip><Translate id="common.resend_mail" /></Tooltip>}
  >
    <Button aria-label="Resend email" variant="link" className={`p-0 ${className}`} {...rest}>
      <BiMailSend size={25} />
    </Button>
  </OverlayTrigger>
);

MailSendAction.propTypes = {
  className: PropTypes.string,
  rest: PropTypes.any
};

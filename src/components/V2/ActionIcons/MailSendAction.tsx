import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { BiMailSend } from 'react-icons/bi';

export const MailSendAction = ({ className, ...rest }: any) => (
  <OverlayTrigger
    overlay={<Tooltip id="resend-email"><Translate id="common.resend_mail" /></Tooltip>}
  >
    <Button aria-label="Resend email" variant="link" className={`p-0 ${className}`} {...rest}>
      <BiMailSend size={25} />
    </Button>
  </OverlayTrigger>
);

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { IoKey } from 'react-icons/io5';

export const ResetUserOTPAction = ({ className, ...rest }: any) => (
  <OverlayTrigger overlay={<Tooltip id="reset-user-otp-tooltip"><Translate id="common.reset_user_otp" /></Tooltip>}>
    <Button aria-label="Reset User OTP" variant="link" className={`p-0 ${className}`} {...rest}>
      <IoKey size={25} />
    </Button>
  </OverlayTrigger>
);

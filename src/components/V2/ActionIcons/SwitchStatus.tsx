import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';

export const DisabledAction = ({ className, ...rest }: any) => (
  <OverlayTrigger
    overlay={<Tooltip id="enabled"><Translate id="common.enabled" /></Tooltip>}
  >
    <Button aria-label="Enabled" variant="link" className={`text-success p-0 ${className}`} {...rest}>
      <FaToggleOff size={20} />
    </Button>
  </OverlayTrigger>
);

export const EnabledAction = ({ className, ...rest } : any) => (
  <OverlayTrigger
    overlay={<Tooltip id="disabled"><Translate id="common.disabled" /></Tooltip>}
  >
    <Button aria-label="Disabled" variant="link" className={`text-success p-0 ${className}`} {...rest}>
      <FaToggleOn size={20} />
    </Button>
  </OverlayTrigger>
);

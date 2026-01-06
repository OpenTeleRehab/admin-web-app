import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { RiAiGenerate } from 'react-icons/ri';

export const RegenerateAction = ({ className, ...rest }: any) => (
  <OverlayTrigger overlay={<Tooltip id="regenerate-secret-key-tooltip"><Translate id="api_client.regenerate.secret_key" /></Tooltip>}>
    <Button aria-label="Regenerate secret key" variant="link" className={`p-0 ${className}`} {...rest}>
      <RiAiGenerate size={25} color="grey" />
    </Button>
  </OverlayTrigger>
);

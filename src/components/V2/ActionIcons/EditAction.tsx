import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import { BiEdit } from 'react-icons/bi';

export const EditAction = ({ className, ...rest }: any) => (
  <OverlayTrigger overlay={<Tooltip id="edit-tooltip"><Translate id="common.edit" /></Tooltip>}>
    <Button aria-label="Edit" variant="link" className={`p-0 ${className}`} {...rest}>
      <BiEdit size={25} />
    </Button>
  </OverlayTrigger>
);

import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { IPhcServiceEntitiesCount } from 'interfaces/IPHCService';
import { Button } from 'react-bootstrap';
import { END_POINTS } from 'variables/endPoint';

type DeletePhcServiceConfirmationProps = {
  phcServiceId: number;
  onConfirm: () => void;
}

const DeletePhcServiceConfirmation = ({ phcServiceId, onConfirm }: DeletePhcServiceConfirmationProps) => {
  const t = useTranslate();
  const { closeDialog } = useDialog();
  const { data: phcServiceEntitiesCount } = useOne<IPhcServiceEntitiesCount>(END_POINTS.PHC_SERVICES, `${phcServiceId}/entities`);

  const mappedContent = [
    { label: t('common.phc_service_admin'), value: phcServiceEntitiesCount?.phc_service_admin_count },
    { label: t('common.phc_worker'), value: phcServiceEntitiesCount?.phc_worker_count },
    { label: t('common.patient'), value: phcServiceEntitiesCount?.patient_count },
  ];

  return (
    <>
      <DialogBody>
        <h5>{t('phc_service.delete.double_confirmation_message')}</h5>
        <ul>
          {mappedContent.map((content, index) => (
            <li key={`${index}-${content.label}`}>
              {content.label}: <span>{content.value}</span>
            </li>
          ))}
        </ul>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" onClick={onConfirm}>{t('common.confirm')}</Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </>
  );
};

export default DeletePhcServiceConfirmation;

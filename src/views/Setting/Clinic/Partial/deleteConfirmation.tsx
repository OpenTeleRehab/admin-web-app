import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { IClinicEntitiesCount } from 'interfaces/IClinic';
import { Button } from 'react-bootstrap';
import { END_POINTS } from 'variables/endPoint';

type DeleteClinicConfirmationProps = {
  clinicId: number;
  onConfirm: () => void;
}

const DeleteClinicConfirmation = ({ clinicId, onConfirm }: DeleteClinicConfirmationProps) => {
  const t = useTranslate();
  const { closeDialog } = useDialog();
  const { data: clinicEntitiesCount } = useOne<IClinicEntitiesCount>(END_POINTS.CLINIC, `${clinicId}/entities`);

  const mappedContent = [
    { label: t('clinic_admin'), value: clinicEntitiesCount?.rehab_service_admin_count },
    { label: t('common.therapist'), value: clinicEntitiesCount?.therapist_count },
    { label: t('common.patient'), value: clinicEntitiesCount?.patient_count },
  ];

  return (
    <>
      <DialogBody>
        <h5>{t('clinic.delete.double_confirmation_message')}</h5>
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

export default DeleteClinicConfirmation;

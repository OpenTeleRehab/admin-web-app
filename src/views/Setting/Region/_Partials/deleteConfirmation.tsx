import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { IRegionEntitiesCount } from 'interfaces/IRegion';
import { Button } from 'react-bootstrap';
import { END_POINTS } from 'variables/endPoint';

type DeleteRegionConfirmationProps = {
  regionId: number;
  onConfirm: () => void;
}

const DeleteRegionConfirmation = ({ regionId, onConfirm }: DeleteRegionConfirmationProps) => {
  const t = useTranslate();
  const { closeDialog } = useDialog();
  const { data: regionEntitiesCount } = useOne<IRegionEntitiesCount>(END_POINTS.REGION, `${regionId}/entities`);

  const mappedContent = [
    { label: t('common.regional_admin'), value: regionEntitiesCount?.regional_admin_count },
    { label: t('common.province'), value: regionEntitiesCount?.province_count },
    { label: t('common.clinic'), value: regionEntitiesCount?.rehab_service_count },
    { label: t('clinic_admin'), value: regionEntitiesCount?.rehab_service_admin_count },
    { label: t('common.phc_service'), value: regionEntitiesCount?.phc_service_count },
    { label: t('common.phc_service_admin'), value: regionEntitiesCount?.phc_service_admin_count },
    { label: t('common.therapist'), value: regionEntitiesCount?.therapist_count },
    { label: t('common.phc_worker'), value: regionEntitiesCount?.phc_worker_count },
    { label: t('common.patient'), value: regionEntitiesCount?.patient_count },
  ];

  return (
    <>
      <DialogBody>
        <h5>{t('region.delete.double_confirmation_message')}</h5>
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

export default DeleteRegionConfirmation;

import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { IProvinceEntitiesCount } from 'interfaces/IProvince';
import { Button } from 'react-bootstrap';
import { END_POINTS } from 'variables/endPoint';

type DeleteProvinceConfirmationProps = {
  provinceId: number;
  onConfirm: () => void;
}

const DeleteProvinceConfirmation = ({ provinceId, onConfirm }: DeleteProvinceConfirmationProps) => {
  const t = useTranslate();
  const { closeDialog } = useDialog();
  const { data: provinceEntitiesCount } = useOne<IProvinceEntitiesCount>(END_POINTS.PROVINCE, `${provinceId}/entities`);

  const mappedContent = [
    { label: t('common.clinic'), value: provinceEntitiesCount?.rehab_service_count },
    { label: t('clinic_admin'), value: provinceEntitiesCount?.rehab_service_admin_count },
    { label: t('common.phc_service'), value: provinceEntitiesCount?.phc_service_count },
    { label: t('common.phc_service_admin'), value: provinceEntitiesCount?.phc_service_admin_count },
    { label: t('common.therapist'), value: provinceEntitiesCount?.therapist_count },
    { label: t('common.phc_worker'), value: provinceEntitiesCount?.phc_worker_count },
    { label: t('common.patient'), value: provinceEntitiesCount?.patient_count },
  ];

  return (
    <>
      <DialogBody>
        <h5>{t('province.delete.double_confirmation_message')}</h5>
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

export default DeleteProvinceConfirmation;

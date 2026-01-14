import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { ICountryEntitiesCount } from 'interfaces/ICountry';
import { Button } from 'react-bootstrap';
import { END_POINTS } from 'variables/endPoint';

type DeleteCountryConfirmationProps = {
  countryId: number;
  onConfirm: () => void;
}

const DeleteCountryConfirmation = ({ countryId, onConfirm }: DeleteCountryConfirmationProps) => {
  const t = useTranslate();
  const { closeDialog } = useDialog();
  const { data: countryEntitiesCount } = useOne<ICountryEntitiesCount>(END_POINTS.COUNTRY, `${countryId}/entities`);

  const mappedContent = [
    { label: t('country_admin'), value: countryEntitiesCount?.country_admin_count },
    { label: t('common.region'), value: countryEntitiesCount?.region_count },
    { label: t('common.regional_admin'), value: countryEntitiesCount?.regional_admin_count },
    { label: t('common.province'), value: countryEntitiesCount?.province_count },
    { label: t('common.clinic'), value: countryEntitiesCount?.rehab_service_count },
    { label: t('clinic_admin'), value: countryEntitiesCount?.rehab_service_admin_count },
    { label: t('common.phc_service'), value: countryEntitiesCount?.phc_service_count },
    { label: t('common.phc_service_admin'), value: countryEntitiesCount?.phc_service_admin_count },
    { label: t('common.therapist'), value: countryEntitiesCount?.therapist_count },
    { label: t('common.phc_worker'), value: countryEntitiesCount?.phc_worker_count },
    { label: t('common.patient'), value: countryEntitiesCount?.patient_count },
  ];

  return (
    <>
      <DialogBody>
        <h5>{t('country.delete.double_confirmation_message')}</h5>
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

export default DeleteCountryConfirmation;

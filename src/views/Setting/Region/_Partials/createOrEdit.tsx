import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Input from 'components/V2/Form/Input';
import Select from 'components/V2/Form/Select';
import useToast from 'components/V2/Toast';
import { useCreate } from 'hooks/useCreate';
import { useInvalidate } from 'hooks/useInvalidate';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { useUpdate } from 'hooks/useUpdate';
import { ICountryResource } from 'interfaces/ICountry';
import { ICountryLimitation } from 'interfaces/ILimitation';
import { IRegionResource } from 'interfaces/IRegion';
import { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { END_POINTS } from 'variables/endPoint';
import { USER_GROUPS } from 'variables/user';

type CreateOrEditRegionProps = {
  regionData: IRegionResource;
}

const CreateOrEditRegion = ({ regionData }: CreateOrEditRegionProps) => {
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { control, reset, handleSubmit } = useForm<any>();
  const t = useTranslate();
  const { profile } = useSelector((state: any) => state.auth);
  const countries = useSelector((state: any) => state.country.countries);
  const { mutate: createRegionMutation } = useCreate(END_POINTS.REGION);
  const { mutate: updateRegionMutation } = useUpdate(END_POINTS.REGION);
  const { data: countryLimitation } = useOne<ICountryLimitation>(END_POINTS.COUNTRY_LIMITATION, null, { enabled: true });

  useEffect(() => {
    if (regionData) {
      reset(regionData);
    }
  }, [reset, regionData]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));

    if (regionData) {
      updateRegionMutation({ id: regionData.id, payload: data }, {
        onSuccess: async (res) => {
          dispatch(showSpinner(false));
          invalidate(END_POINTS.COUNTRY_LIMITATION);
          showToast({
            title: t('region.toast_title.edit'),
            message: t(res.message),
            color: 'success'
          });
          closeDialog();
        },
        onError: () => {
          invalidate(END_POINTS.COUNTRY_LIMITATION);
          dispatch(showSpinner(false));
        }
      });

      return;
    }

    createRegionMutation(data, {
      onSuccess: async (res) => {
        dispatch(showSpinner(false));
        invalidate(END_POINTS.COUNTRY_LIMITATION);
        showToast({
          title: t('region.toast_title.new'),
          message: t(res?.message),
          color: 'success'
        });
        closeDialog();
      },
      onError: () => {
        invalidate(END_POINTS.COUNTRY_LIMITATION);
        dispatch(showSpinner(false));
      }
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        {[USER_GROUPS.SUPER_ADMIN, USER_GROUPS.ORGANIZATION_ADMIN].includes(profile.type) && (
          <Select
            control={control}
            name='country_id'
            options={countries.map((country: ICountryResource) => ({
              label: country.name,
              value: country.id
            }))}
            label={t('common.country')}
            placeholder={t('placeholder.country')}
            rules={{ required: t('error.country') }}
          />
        )}
        <Input
          control={control}
          name='name'
          label={t('common.name')}
          placeholder={t('region.name')}
          rules={{ required: t('region.name.error') }}
        />
        <Row>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='therapist_limit'
              label={t('common.therapist_limit')}
              placeholder={t('common.therapist_limit.placeholder')}
              type='number'
              rules={{
                required: t('common.therapist_limit.error'),
                validate: (value) => {
                  const numValue = Number(value);
                  const remainingTherapistLimit = countryLimitation ? countryLimitation.remaining_therapist_limit : 0;
                  const exceedremainingTherapistLimit = regionData ? numValue > remainingTherapistLimit + regionData.therapist_limit : numValue > remainingTherapistLimit;

                  if (value <= 0) {
                    return t('error.region.therapist_limit.equal_to.zero');
                  }

                  if (exceedremainingTherapistLimit) {
                    return t('error.region.therapist_limit.greater_than.country.therapist_limit');
                  }

                  return true;
                }
              }}
            />
          </Col>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='phc_worker_limit'
              label={t('common.phc_worker_limit')}
              placeholder={t('common.phc_worker_limit.placeholder')}
              type='number'
              rules={{
                required: t('common.phc_worker_limit.error'),
                validate: (value) => {
                  const numValue = Number(value);
                  const remainingPhcWorkerLimit = countryLimitation ? countryLimitation.remaining_phc_worker_limit : 0;
                  const exceedremainingPhcWorkerLimit = regionData ? numValue > remainingPhcWorkerLimit + regionData.phc_worker_limit : numValue > remainingPhcWorkerLimit;

                  if (value <= 0) {
                    return t('error.region.phc_worker_limit.equal_to.zero');
                  }

                  if (exceedremainingPhcWorkerLimit) {
                    return t('error.region.phc_worker_limit.greater_than.country.phc_worker_limit');
                  }

                  return true;
                }
              }}
            />
          </Col>
        </Row>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit'>
          {t('common.save')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateOrEditRegion;

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
import { ILimitation } from 'interfaces/ILimitation';
import { IProvinceResource } from 'interfaces/IProvince';
import { IAdminRegion } from 'interfaces/IRegion';
import { useEffect, useMemo } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { END_POINTS } from 'variables/endPoint';

type CreateOrEditProvinceProps = {
  provinceData: IProvinceResource;
};

const CreateOrEditProvince = ({ provinceData }: CreateOrEditProvinceProps) => {
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { control, reset, handleSubmit, setValue, watch } = useForm<any>();
  const { profile } = useSelector((state: any) => state.auth);
  const t = useTranslate();

  const selectedRegionId = watch('region_id');

  const { mutate: createProvinceMutation } = useCreate(END_POINTS.PROVINCE);
  const { mutate: updateProvinceMutation } = useUpdate(END_POINTS.PROVINCE);
  const { data: regionLimitation } = useOne<ILimitation>(
    END_POINTS.REGION_LIMITATION,
    null,
    {
      enabled: true,
      params: { region_id: selectedRegionId },
    },
  );

  const { data: provinceLimitation } = useOne<ILimitation>(
    END_POINTS.PROVINCE_LIMITATION,
    provinceData?.id || null,
    {
      enabled: !!provinceData?.id,
    },
  );

  useEffect(() => {
    if (provinceData) {
      reset(provinceData);
    } else {
      setValue('region_id', profile?.region_id);
    }
  }, [reset, provinceData]);

  const regionOptions = useMemo(() => {
    if (profile?.admin_regions?.length > 0) {
      return profile.admin_regions.map((region: IAdminRegion) => ({
        label: region.name,
        value: region.id,
      }));
    }
    if (profile?.region_id && profile?.region_name) {
      return [
        {
          label: profile.region_name,
          value: profile.region_id,
        },
      ];
    }
    return [];
  }, [profile]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));

    if (provinceData) {
      updateProvinceMutation(
        { id: provinceData.id, payload: data },
        {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            invalidate(END_POINTS.REGION_LIMITATION);
            invalidate(END_POINTS.COUNT_THERAPIST_BY_CLINIC);
            showToast({
              title: t('province.toast_title.edit'),
              message: t(res.message),
              color: 'success'
            });
            closeDialog();
          },
          onError: () => {
            invalidate(END_POINTS.REGION_LIMITATION);
            invalidate(END_POINTS.COUNT_THERAPIST_BY_CLINIC);
            dispatch(showSpinner(false));
          },
        },
      );

      return;
    }

    createProvinceMutation(data, {
      onSuccess: async (res) => {
        dispatch(showSpinner(false));
        invalidate(END_POINTS.REGION_LIMITATION);
        showToast({
          title: t('province.toast_title.new'),
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
        <Row>
          <Col>
            <Input
              control={control}
              name='name'
              label={t('common.name')}
              placeholder={t('province.name')}
              rules={{ required: t('province.name.error') }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              control={control}
              name='region_id'
              options={regionOptions}
              label={t('common.region')}
              placeholder={t('placeholder.region')}
              rules={{
                required: true,
                validate: (value) => value !== 0 || t('region.required'),
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='therapist_limit'
              label={t('common.therapist_limit')}
              placeholder={t('common.therapist_limit.placeholder')}
              type='number'
              min={0}
              rules={{
                required: t('common.therapist_limit.error'),
                validate: (value) => {
                  const numValue = Number(value);
                  const remainingTherapistLimit = regionLimitation
                    ? regionLimitation.remaining_therapist_limit
                    : 0;
                  const usedTherapistLimit = regionLimitation
                    ? regionLimitation.therapist_limit_used
                    : 0;
                  const exceedremainingTherapistLimit = provinceData
                    ? numValue >
                      remainingTherapistLimit + provinceData.therapist_limit
                    : numValue > remainingTherapistLimit;
                  const translateParams = {
                    allocated_therapist_limit:
                      regionLimitation?.allocated_therapist_limit,
                    remaining_therapist_limit:
                      remainingTherapistLimit +
                      (provinceData?.therapist_limit ?? 0),
                    therapist_limit_used:
                      usedTherapistLimit - (provinceData?.therapist_limit ?? 0),
                  };

                  if (value <= 0) {
                    return t('error.province.therapist_limit.equal_to.zero');
                  }

                  if (exceedremainingTherapistLimit) {
                    return t(
                      'error.province.therapist_limit.greater_than.region.therapist_limit', { ...translateParams }
                    );
                  }

                  if (
                    provinceLimitation?.therapist_limit_used !== undefined &&
                    provinceLimitation?.therapist_limit_used > numValue
                  ) {
                    return t(
                      'error.province.therapist_limit.less_than.total.clinic.therapist_limit',
                      { phc_worker_limit_used: provinceLimitation?.phc_worker_limit_used ?? 0 }
                    );
                  }

                  return true;
                },
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
              min={0}
              rules={{
                required: t('common.phc_worker_limit.error'),
                validate: (value) => {
                  const numValue = Number(value);
                  const remainingPhcWorkerLimit = regionLimitation
                    ? regionLimitation.remaining_phc_worker_limit
                    : 0;
                  const exceedremainingPhcWorkerLimit = provinceData
                    ? numValue >
                      remainingPhcWorkerLimit + provinceData.phc_worker_limit
                    : numValue > remainingPhcWorkerLimit;

                  if (value <= 0) {
                    return t('error.province.phc_worker_limit.equal_to.zero');
                  }

                  if (exceedremainingPhcWorkerLimit) {
                    return t(
                      'error.province.phc_worker_limit.greater_than.region.phc_worker_limit',
                    );
                  }

                  if (
                    provinceLimitation?.phc_worker_limit_used !== undefined &&
                    provinceLimitation?.phc_worker_limit_used > numValue
                  ) {
                    return t(
                      'error.province.phc_worker_limit.less_than.total.clinic.phc_worker_limit',
                      { phc_worker_limit_used: provinceLimitation?.phc_worker_limit_used ?? 0 }
                    );
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
          {provinceData ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateOrEditProvince;

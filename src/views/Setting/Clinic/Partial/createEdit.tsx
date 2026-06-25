import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Input from 'components/V2/Form/Input';
import Select from 'components/V2/Form/Select';
import useToast from 'components/V2/Toast';
import { useCreate } from 'hooks/useCreate';
import { useUpdate } from 'hooks/useUpdate';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { useEffect, useMemo } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import PhoneInput from 'components/V2/Form/PhoneInput';
import { END_POINTS } from 'variables/endPoint';
import { ILimitation } from 'interfaces/ILimitation';
import { useInvalidate } from 'hooks/useInvalidate';
import { useList } from 'hooks/useList';
import { IProvinceResource } from 'interfaces/IProvince';
import { IRegion } from 'interfaces/IRegion';

const CreateEditClinic = ({ clinic }: { clinic: any }) => {
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { control, setValue, reset, watch, handleSubmit } = useForm<any>();
  const t = useTranslate();
  const { profile } = useSelector((state: any) => state.auth);
  const { mutate: createServiceMutation } = useCreate(END_POINTS.CLINIC);
  const { mutate: updateServiceMutation } = useUpdate(END_POINTS.CLINIC);
  const provinceId = watch('province_id');
  const { data: provinceLimitation } = useOne<ILimitation>(END_POINTS.PROVINCE_LIMITATION, provinceId, { enabled: !!provinceId });
  const { data: provinces } = useList<IProvinceResource>(END_POINTS.PROVINCE_BY_REGION);
  const { data: totalTherapist } = useOne(END_POINTS.COUNT_THERAPIST_BY_CLINIC, null, {
    enabled: !!clinic?.id,
    params: {
      clinic_id: clinic?.id
    }
  });

  const regionId = watch('region_id');

  const regionOptions = useMemo(() => {
    if (profile?.regions?.length > 0) {
      return profile.regions.map((region: IRegion) => ({
        label: region.name,
        value: region.id,
      }));
    }

    if (profile?.region_id) {
      return [
        {
          label: profile.region_name,
          value: profile.region_id,
        },
      ];
    }
    return [];
  }, [profile]);
  const provinceOptions = useMemo(() => {
    const filtered = (provinces?.data || []).filter((province: IProvinceResource) => province.region_id === regionId).map((province: IProvinceResource) => ({
         label: province.name,
         value: province.id,
    }));
    return filtered;
  }, [provinces, regionId]);

  useEffect(() => {
    if (clinic) {
      reset({
        ...clinic,
        region_id: clinic?.region?.id,
        province_id: clinic?.province?.id,
      });
    }
  }, [reset, clinic, setValue]);

  useEffect(() => {
    if (profile && !clinic) {
      setValue('region_id', profile.region_id);
    }
  }, [profile, setValue, clinic]);

  useEffect(() => {
    if (regionId) {
        const isSameRegion = clinic?.region?.id === regionId;
        if (!isSameRegion) {
            setValue('province_id', null);
        }
    }
  }, [regionId, setValue, clinic]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));
    if (clinic) {
      const payload = {
        ...data,
        country_id: clinic.country_id
      };
      updateServiceMutation({ id: clinic.id, payload }, {
        onSuccess: async (res) => {
          dispatch(showSpinner(false));
          invalidate(END_POINTS.PROVINCE_LIMITATION);
          showToast({
            title: t('toast_title.edit_clinic'),
            message: t(res?.message),
            color: 'success'
          });
          closeDialog();
        },
        onError: () => {
          invalidate(END_POINTS.PROVINCE_LIMITATION);
          dispatch(showSpinner(false));
        }
      });
    } else {
      const payload = {
        ...data,
        country_id: profile.country_id,
      };
      createServiceMutation(payload, {
      onSuccess: async (res) => {
        dispatch(showSpinner(false));
        invalidate(END_POINTS.PROVINCE_LIMITATION);
        showToast({
          title: t('toast_title.new_clinic'),
          message: t(res?.message),
          color: 'success'
        });
        closeDialog();
      },
      onError: () => {
        invalidate(END_POINTS.PROVINCE_LIMITATION);
        dispatch(showSpinner(false));
      }
    });
    }
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
              placeholder={t('common.name.placeholder')}
              rules={{ required: t('common.name.error') }}
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
              rules={{ required: t('region.required') }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              control={control}
              name='province_id'
              options={provinceOptions}
              label={t('common.province')}
              placeholder={t('common.province.placeholder')}
              rules={{ required: t('common.province.error') }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <PhoneInput
              control={control}
              name='phone'
              label={t('common.phone.number')}
              rules={{
                required: t('error.phone'),
                validate: (value) => {
                  const dialCode = watch('dial_code');

                  if (dialCode === value) {
                    return t('error.phone');
                  }

                  return true;
                }
              }}
              setValue={setValue}
            />
          </Col>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='therapist_limit'
              label={t('common.therapist_limit')}
              placeholder={t('placeholder.country.therapist_limit')}
              type='number'
              min={0}
              rules={{
                required: t('error.clinic.therapist_limit'),
                validate: (value) => {
                  const numValue = Number(value);
                  const isSameProvince = clinic && (clinic.province?.id === provinceId);
                  const currentLimitCredit = isSameProvince ? (clinic?.therapist_limit ?? 0) : 0;
                  const remainingTherapistLimit = provinceLimitation ? provinceLimitation.remaining_therapist_limit : 0;
                  const usedTherapistLimit = provinceLimitation ? provinceLimitation.therapist_limit_used : 0;
                  const exceedRemainingTherapistLimit = numValue > remainingTherapistLimit + currentLimitCredit;
                  const translateParams = {
                    allocated_therapist_limit: provinceLimitation?.allocated_therapist_limit,
                    remaining_therapist_limit: remainingTherapistLimit + currentLimitCredit,
                    therapist_limit_used: usedTherapistLimit - currentLimitCredit,
                  };

                  if (value <= 0) {
                    return t('error.clinic.therapist_limit');
                  }

                  if (value < totalTherapist?.therapistTotal) {
                    return t('error.clinic.therapist_limit.less_than.total.therapist', { total_therapist: totalTherapist?.therapistTotal });
                  }

                  if (exceedRemainingTherapistLimit) {
                    return t('error.clinic.therapist_limit.greater_than.province.therapist_limit', { ...translateParams });
                  }

                  return true;
                }
              }}
              disabled={!provinceId}
            />
          </Col>
        </Row>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit'>
          {clinic ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateEditClinic;

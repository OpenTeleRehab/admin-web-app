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
import { IPHCService } from 'interfaces/IPHCService';
import { END_POINTS } from 'variables/endPoint';
import { ILimitation } from 'interfaces/ILimitation';
import { useInvalidate } from 'hooks/useInvalidate';
import { useList } from 'hooks/useList';
import { IProvinceResource } from 'interfaces/IProvince';
import { IRegion } from 'interfaces/IRegion';

const CreateEditPhcService = ({ phcService }: { phcService: IPHCService }) => {
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { control, setValue, reset, watch, handleSubmit } = useForm<any>();
  const t = useTranslate();
  const { profile } = useSelector((state: any) => state.auth);
  const { mutate: createPhcServiceMutation } = useCreate(END_POINTS.PHC_SERVICES);
  const { mutate: updatePhcServiceMutation } = useUpdate(END_POINTS.PHC_SERVICES);
  const provinceId = watch('province_id');
  const { data: provinceLimitation } = useOne<ILimitation>(END_POINTS.PROVINCE_LIMITATION, provinceId, { enabled: !!provinceId });
  const { data: provinces } = useList<IProvinceResource>(END_POINTS.PROVINCE_BY_REGION);

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
    if (phcService) {
      reset({
        ...phcService,
        region_id: phcService.region_id || phcService.province?.region_id,
      });
    }
  }, [reset, phcService, setValue]);

  useEffect(() => {
    if (profile && !phcService) {
      setValue('region_id', profile.region_id);
    }
  }, [profile, setValue, phcService]);

  useEffect(() => {
     if (regionId) {
        const isSameRegion = phcService?.region_id === regionId || phcService?.province?.region_id === regionId;
        if (!isSameRegion) {
        setValue('province_id', null);
      }
     }
  }, [regionId, setValue, phcService]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));

    if (phcService) {
      updatePhcServiceMutation({ id: phcService.id, payload: data }, {
        onSuccess: async (res) => {
          dispatch(showSpinner(false));
          invalidate(END_POINTS.PROVINCE_LIMITATION);
          showToast({
            title: t('phc_service.toast_title.edit'),
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

      return;
    }

    createPhcServiceMutation(data, {
      onSuccess: async (res) => {
        dispatch(showSpinner(false));
        invalidate(END_POINTS.PROVINCE_LIMITATION);
        showToast({
          title: t('phc_service.toast_title.new'),
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
              placeholder={t('common.region.placeholder')}
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
              name='phone_number'
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
              name='phc_worker_limit'
              label={t('common.phc_worker_limit')}
              placeholder={t('common.phc_worker_limit.placeholder')}
              type='number'
              min={0}
              rules={{
                required: t('common.phc_worker_limit.error'),
                validate: (value) => {
                  const numValue = Number(value);
                  const isSameProvince = phcService && (phcService.province_id === provinceId || phcService.province?.id === provinceId);
                  const currentLimitCredit = isSameProvince ? (phcService?.phc_worker_limit ?? 0) : 0;
                  const remainingPhcWorkerLimit = provinceLimitation ? provinceLimitation.remaining_phc_worker_limit : 0;
                  const usedPhcworkerLimit = provinceLimitation ? provinceLimitation.phc_worker_limit_used : 0;
                  const exceedremainingPhcWorkerLimit = numValue > remainingPhcWorkerLimit + currentLimitCredit;
                  const translateParams = {
                    allocated_phc_worker_limit: provinceLimitation?.allocated_phc_worker_limit,
                    remaining_phc_worker_limit: remainingPhcWorkerLimit + currentLimitCredit,
                    phc_worker_limit_used: usedPhcworkerLimit - currentLimitCredit,
                  };

                  if (value <= 0) {
                    return t('error.phc_service.phc_worker_limit.equal_to.zero');
                  }

                  if (exceedremainingPhcWorkerLimit) {
                    return t('error.phc_service.phc_worker_limit.greater_than.province.phc_worker_limit', { ...translateParams });
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
          {phcService ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateEditPhcService;

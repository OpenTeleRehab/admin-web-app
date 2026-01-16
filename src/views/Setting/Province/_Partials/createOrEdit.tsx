import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Input from 'components/V2/Form/Input';
import useToast from 'components/V2/Toast';
import { useCreate } from 'hooks/useCreate';
import { useInvalidate } from 'hooks/useInvalidate';
import { useList } from 'hooks/useList';
import { useOne } from 'hooks/useOne';
import { useTranslate } from 'hooks/useTranslate';
import { useUpdate } from 'hooks/useUpdate';
import { ILimitation } from 'interfaces/ILimitation';
import { IProvinceResource } from 'interfaces/IProvince';
import { useEffect, useMemo } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { END_POINTS } from 'variables/endPoint';

type CreateOrEditProvinceProps = {
  provinceData: IProvinceResource;
}

const CreateOrEditProvince = ({ provinceData }: CreateOrEditProvinceProps) => {
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { control, reset, handleSubmit, setValue } = useForm<any>();
  const { profile } = useSelector((state: any) => state.auth);
  const t = useTranslate();
  const { mutate: createProvinceMutation } = useCreate(END_POINTS.PROVINCE);
  const { mutate: updateProvinceMutation } = useUpdate(END_POINTS.PROVINCE);
  const { data: regionLimitation } = useOne<ILimitation>(END_POINTS.REGION_LIMITATION, null, { enabled: true });
  const { data: provincesLimitation } = useList(END_POINTS.PROVINCES_LIMITATION);
  const provinceLimitation = useMemo(() => {
    const provinceLimitation = provincesLimitation?.data?.find((province) => province.id === provinceData?.id);
    return provinceLimitation;
  }, [provincesLimitation, provinceData?.id]);

  useEffect(() => {
    if (provinceData) {
      reset(provinceData);
    } else {
      setValue('region_name', profile?.region_name);
    }
  }, [reset, provinceData]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));

    if (provinceData) {
      updateProvinceMutation({ id: provinceData.id, payload: data }, {
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
        }
      });

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
            <Input
              control={control}
              name='region_name'
              label={t('common.region')}
              disabled
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
                  const remainingTherapistLimit = regionLimitation ? regionLimitation.remaining_therapist_limit : 0;
                  const usedTherapistLimit = regionLimitation ? regionLimitation.therapist_limit_used : 0;
                  const exceedremainingTherapistLimit = provinceData ? numValue > remainingTherapistLimit + provinceData.therapist_limit : numValue > remainingTherapistLimit;
                  const translateParams = {
                    allocated_therapist_limit: regionLimitation?.allocated_therapist_limit,
                    remaining_therapist_limit: remainingTherapistLimit + (provinceData?.therapist_limit ?? 0),
                    therapist_limit_used: usedTherapistLimit - (provinceData?.therapist_limit ?? 0),
                  };

                  if (value <= 0) {
                    return t('error.province.therapist_limit.equal_to.zero');
                  }

                  if (exceedremainingTherapistLimit) {
                    return t('error.province.therapist_limit.greater_than.region.therapist_limit', { ...translateParams });
                  }

                  if (provinceLimitation?.therapist_limit_used > numValue) {
                    return t('error.province.therapist_limit.less_than.total.clinic.therapist_limit', { therapist_limit_used: provinceLimitation?.therapist_limit_used ?? 0 });
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
              min={0}
              rules={{
                required: t('common.phc_worker_limit.error'),
                validate: (value) => {
                  const numValue = Number(value);
                  const remainingPhcWorkerLimit = regionLimitation ? regionLimitation.remaining_phc_worker_limit : 0;
                  const usedPhcWorkerLimit = regionLimitation ? regionLimitation.phc_worker_limit_used : 0;
                  const exceedremainingPhcWorkerLimit = provinceData ? numValue > remainingPhcWorkerLimit + provinceData.phc_worker_limit : numValue > remainingPhcWorkerLimit;
                  const translateParams = {
                    allocated_phc_worker_limit: regionLimitation?.allocated_phc_worker_limit,
                    remaining_phc_worker_limit: remainingPhcWorkerLimit + (provinceData?.phc_worker_limit ?? 0),
                    phc_worker_limit_used: usedPhcWorkerLimit - (provinceData?.phc_worker_limit ?? 0),
                  };

                  if (value <= 0) {
                    return t('error.province.phc_worker_limit.equal_to.zero');
                  }

                  if (exceedremainingPhcWorkerLimit) {
                    return t('error.province.phc_worker_limit.greater_than.region.phc_worker_limit', { ...translateParams });
                  }

                  if (provinceLimitation?.phc_worker_limit_used > numValue) {
                    return t('error.province.phc_worker_limit.less_than.total.clinic.phc_worker_limit', { phc_worker_limit_used: provinceLimitation?.phc_worker_limit_used ?? 0 });
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

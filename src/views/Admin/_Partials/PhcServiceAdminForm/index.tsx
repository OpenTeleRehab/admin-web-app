import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Input from 'components/V2/Form/Input';
import Select from 'components/V2/Form/Select';
import useToast from 'components/V2/Toast';
import { useCreate } from 'hooks/useCreate';
import { useUpdate } from 'hooks/useUpdate';
import { useList } from 'hooks/useList';
import { useTranslate } from 'hooks/useTranslate';
import { useEffect, useMemo } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { USER_GROUPS } from 'variables/user';
import { END_POINTS } from 'variables/endPoint';
import { IUser } from 'interfaces/IUser';
import { IProvinceResource } from 'interfaces/IProvince';
import { IRegion } from 'interfaces/IRegion';

const createEditPhcServiceAdmin = ({ phcServiceAdmin } : { phcServiceAdmin?: IUser }) => {
  const dispatch = useDispatch();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { control, setValue, reset, handleSubmit, watch, formState } = useForm<any>();
  const t = useTranslate();
  const { profile } = useSelector((state: any) => state.auth);
  const { mutate: createUserMutation } = useCreate(END_POINTS.ADMIN);
  const { mutate: updateUserMutation } = useUpdate(END_POINTS.ADMIN);
  const { data: phcServices } = useList(END_POINTS.PHC_SERVICES_BY_PROVINCE, { province_id: watch('province_id') }, { enabled: !!watch('province_id') });
  const { data: provinces } = useList(END_POINTS.PROVINCE_BY_REGION);
  const isRegionDirty = formState.dirtyFields.region_id;
  const isProvinceDirty = formState.dirtyFields.province_id;

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
    const provinceData = provinces?.data || [];
    const selectedRegionId = watch('region_id');
    if (selectedRegionId) {
      return provinceData
        .filter((province: IProvinceResource) => province.region_id === parseInt(selectedRegionId))
        .map((province: IProvinceResource) => ({
          label: province.name,
          value: province.id,
        }));
    }
    return provinceData.map((province: IProvinceResource) => ({
      label: province.name,
      value: province.id,
    }));
  }, [provinces, watch('region_id')]);

  useEffect(() => {
    if (phcServiceAdmin) {
      reset(phcServiceAdmin);
      const province = provinces?.data.find((province) => province.id === phcServiceAdmin.phc_service?.province_id);
      setValue('region_id', province?.region_id);
      setValue('province_id', province?.id);
      setValue('phc_service_id', phcServiceAdmin.phc_service?.id);
    } else {
      setValue('type', USER_GROUPS.PHC_SERVICE_ADMIN);
      setValue('region_id', profile?.region_id);
      setValue('country_id', profile?.country_id);
    }
  }, [reset, phcServiceAdmin, setValue, profile, provinces]);

  useEffect(() => {
    if (isRegionDirty) {
      setValue('province_id', null);
      setValue('phc_service_id', null);
    }
  }, [isRegionDirty, setValue]);

  useEffect(() => {
    if (isProvinceDirty) {
      setValue('phc_service_id', null);
    }
  }, [isProvinceDirty, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));

    if (phcServiceAdmin) {
      updateUserMutation({ id: phcServiceAdmin.id, payload: data }, {
        onSuccess: async (res) => {
          dispatch(showSpinner(false));
          showToast({
            title: t('toast_title.edit_admin_account'),
            message: t(res?.message),
            color: 'success'
          });
          closeDialog();
        }
      });

      return;
    }

    createUserMutation(data, {
      onSuccess: async (res) => {
        dispatch(showSpinner(false));
        showToast({
          title: t('toast_title.new_admin_account'),
          message: t(res?.message),
          color: 'success'
        });
        closeDialog();
      }
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Input
          control={control}
          name='email'
          type='email'
          label={t('common.email')}
          placeholder={t('placeholder.email')}
          rules={{ required: t('error.email') }}
          disabled={!!phcServiceAdmin}
        />
        <Select
          control={control}
          name='region_id'
          options={regionOptions}
          label={t('common.region')}
          placeholder={t('placeholder.region')}
          rules={{ required: t('region.required') }}
        />
        <Select
          control={control}
          name='province_id'
          options={provinceOptions}
          label={t('common.province')}
          placeholder={t('common.province.placeholder')}
          rules={{ required: t('province.required') }}
          isDisabled={!watch('region_id')}
        />
        <Select
          control={control}
          name='phc_service_id'
          options={(phcServices?.data || []).map((phcService) => ({
            label: phcService.name,
            value: phcService.id
          }))}
          label={t('common.phc_service')}
          placeholder={t('phc_service.placeholder')}
          rules={{ required: t('phc_service.required') }}
          isDisabled={!watch('province_id')}
        />
        <Row>
          <Col>
            <Input
              control={control}
              name='last_name'
              label={t('common.last_name')}
              placeholder={t('placeholder.last_name')}
              rules={{ required: t('error.last_name') }}
            />
          </Col>
          <Col>
            <Input
              control={control}
              name='first_name'
              label={t('common.first_name')}
              placeholder={t('placeholder.first_name')}
              rules={{ required: t('error.first_name') }}
            />
          </Col>
        </Row>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit'>
          {phcServiceAdmin ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default createEditPhcServiceAdmin;

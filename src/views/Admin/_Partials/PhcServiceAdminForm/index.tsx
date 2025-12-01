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
import { useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { USER_GROUPS } from 'variables/user';
import { END_POINTS } from 'variables/endPoint';
import { IUser } from 'interfaces/IUser';

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
  const isProvinceDirty = formState.dirtyFields.province_id;

  useEffect(() => {
    if (phcServiceAdmin) {
      reset(phcServiceAdmin);
      const province = provinces?.data.find((province) => province.id === phcServiceAdmin.phc_service?.province_id);
      setValue('province_id', province?.id);
      setValue('phc_service_id', phcServiceAdmin.phc_service?.id);
    } else {
      setValue('type', USER_GROUPS.PHC_SERVICE_ADMIN);
      setValue('region_name', profile?.region_name);
      setValue('country_id', profile?.country_id);
      setValue('region_id', profile?.region_id);
    }
  }, [reset, phcServiceAdmin, setValue, profile, provinces]);

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
        <Input
          control={control}
          name='region_name'
          label={t('common.region')}
          disabled
        />
        <Select
          control={control}
          name='province_id'
          options={(provinces?.data || []).map((province) => ({
            label: province.name,
            value: province.id
          }))}
          label={t('common.province')}
          placeholder={t('common.province.placeholder')}
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
          {t('common.save')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default createEditPhcServiceAdmin;

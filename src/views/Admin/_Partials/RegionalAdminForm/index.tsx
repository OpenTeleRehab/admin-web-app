import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Input from 'components/V2/Form/Input';
import Select from 'components/V2/Form/Select';
import useToast from 'components/V2/Toast';
import { useCreate } from 'hooks/useCreate';
import { useList } from 'hooks/useList';
import { useTranslate } from 'hooks/useTranslate';
import { useUpdate } from 'hooks/useUpdate';
import { IRegionResource } from 'interfaces/IRegion';
import { IRegionalAdminRequest, IUser } from 'interfaces/IUser';
import { useEffect, useMemo } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { END_POINTS } from 'variables/endPoint';
import { USER_GROUPS } from 'variables/user';

type CreateOrEditProps = {
  regionalAdmin: IUser;
};

const CreateOrEdit = ({ regionalAdmin }: CreateOrEditProps) => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const profile = useSelector((state: any) => state.auth.profile);
  const { control, setValue, handleSubmit, reset } =
    useForm<IRegionalAdminRequest>({
      defaultValues: {
        email: '',
        first_name: '',
        last_name: '',
        type: USER_GROUPS.REGIONAL_ADMIN,
        region_id: [],
        country_name: '',
      },
    });
  const { data: regions } = useList<IRegionResource>(END_POINTS.REGION);
  const { mutate: createRegionalAdmin } = useCreate<IRegionalAdminRequest>(
    END_POINTS.ADMIN
  );
  const { mutate: updateRegionalAdmin } = useUpdate<IRegionalAdminRequest>(
    END_POINTS.ADMIN
  );

  const regionOptions = useMemo(
    () =>
      (regions?.data || []).map((opt) => ({ label: opt.name, value: opt.id })),
    [regions]
  );

  useEffect(() => {
    if (profile) {
      setValue('country_name', profile.country_name);
    }
  }, [profile]);

  useEffect(() => {
    if (regionalAdmin) {
      reset({
        email: regionalAdmin.email,
        first_name: regionalAdmin.first_name,
        last_name: regionalAdmin.last_name,
        type: USER_GROUPS.REGIONAL_ADMIN,
        region_id: regionalAdmin.regions?.map((r) => r.id) || [],
        country_name: regionalAdmin.country_name,
      });
    }
  }, [regionalAdmin, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload: IRegionalAdminRequest = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      type: data.type,
      region_id: typeof data.region_id === 'number' ? [data.region_id] : data.region_id,
    };

    if (regionalAdmin) {
      const updatePayload = {
        ...payload,
        edit_region_ids: payload.region_id as number[],
      };
      delete updatePayload.region_id;
      updateRegionalAdmin(
        { id: regionalAdmin.id, payload: updatePayload },
        {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            showToast({
              title: t('toast_title.edit_admin_account'),
              message: t(res?.message),
              color: 'success'
            });
            closeDialog();
          },
          onError: () => {
            dispatch(showSpinner(false));
          }
        }
      );

      return;
    }

    dispatch(showSpinner(true));
    createRegionalAdmin(payload, {
      onSuccess: async (res) => {
        dispatch(showSpinner(false));
        showToast({
          title: t('toast_title.edit_admin_account'),
          message: t(res?.message),
          color: 'success'
        });
        closeDialog();
      },
      onError: () => {
        dispatch(showSpinner(false));
      },
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Form.Group as={Row}>
          <Col md={6}>
            <Form.Check
              name="type"
              value={USER_GROUPS.ORGANIZATION_ADMIN}
              defaultChecked
              type="radio"
              label={t('common.regional_admin')}
              id="formRegionalAdmin"
              disabled={!!regionalAdmin}
            />
          </Col>
        </Form.Group>
        <p className="text-muted font-italic">
          {t('admin.hint_message_regional_admin')}
        </p>
        <Input
          control={control}
          name='email'
          type='email'
          label={t('common.email')}
          placeholder={t('placeholder.email')}
          rules={{ required: t('error.email') }}
          disabled={!!regionalAdmin}
        />
        <Input
          control={control}
          name='country_name'
          label={t('common.country')}
          disabled
        />
        <Select
          control={control}
          name='region_id'
          options={regionOptions}
          isMulti={true}
          label={t('common.region')}
          placeholder={t('placeholder.region')}
          rules={{
            required: true,
            validate: (value) => (Array.isArray(value) && value.length > 0) || t('region.required'),
          }}
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
          {regionalAdmin ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={() => closeDialog()}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateOrEdit;

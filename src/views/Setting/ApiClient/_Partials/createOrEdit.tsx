import { IApiClientRequest, IApiClientResource } from 'interfaces/IApiClient';
import { useForm } from 'react-hook-form';
import Input from 'components/V2/Form/Input';
import { useTranslate } from 'hooks/useTranslate';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { Button, Form } from 'react-bootstrap';
import useDialog from 'components/V2/Dialog';
import { singleIpRegex } from 'variables/setting';
import { useCreate } from 'hooks/useCreate';
import { END_POINTS } from 'variables/endPoint';
import SuccessDialog from './successDialog';
import { useEffect } from 'react';
import { useUpdate } from 'hooks/useUpdate';
import useToast from 'components/V2/Toast';

type CreateOrEditApiClientProps = {
  apiClient?: IApiClientResource;
}

const CreateOrEditApiClient = ({ apiClient }: CreateOrEditApiClientProps) => {
  const t: any = useTranslate();
  const { openDialog, closeDialog } = useDialog();
  const { showToast } = useToast();
  const { control, handleSubmit, reset } = useForm<IApiClientRequest>();
  const { mutate: createApiClient } = useCreate(END_POINTS.API_CLIENT);
  const { mutate: updateApiClient } = useUpdate(END_POINTS.API_CLIENT);

  useEffect(() => {
    if (apiClient) {
      reset({
        name: apiClient.name,
        allow_ips: apiClient.allow_ips?.join(','),
      });
    }
  }, [apiClient]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      allow_ips: data.allow_ips ? data.allow_ips.split(',').map(ip => ip.trim()) : undefined,
    };

    if (apiClient) {
      updateApiClient({ id: apiClient.id, payload }, {
        onSuccess: (res) => {
          showToast({
            title: t('api_client.edit.toast.title'),
            message: t(res.message),
          });
          closeDialog();
        }
      });
    } else {
      createApiClient(payload, {
        onSuccess: (res) => {
          closeDialog();
          openDialog({
            title: t(res.message),
            content: <SuccessDialog apiKey={res.data.api_key} secretKey={res.data.secret_key} />,
            props: { size: 'lg' }
          });
        },
      });
    }
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Input
          control={control}
          name='name'
          label={t('common.name')}
          placeholder={t('api_client.name.placeholder')}
          rules={{
            required: t('common.name.error')
          }}
        />
        <Input
          control={control}
          name='allow_ips'
          label={t('api_client.allow_ips')}
          placeholder={t('api_client.allow_ips.placeholder')}
          rules={{
            validate: value => {
              if (!value) return true;
              const ips = value.split(',').map(ip => ip.trim());
              return ips.every(ip => singleIpRegex.test(ip)) || t('api_client.ip_address.invalid');
            }
          }}
        />
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

export default CreateOrEditApiClient;

import Table from 'components/Table';
import { DeleteAction, DisabledAction, EditAction, EnabledAction } from 'components/V2/ActionIcons';
import useDialog from 'components/V2/Dialog';
import useToast from 'components/V2/Toast';
import { useList } from 'hooks/useList';
import { useTranslate } from 'hooks/useTranslate';
import { useUpdate } from 'hooks/useUpdate';
import { IApiClientResource } from 'interfaces/IApiClient';
import { useMemo } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { END_POINTS } from 'variables/endPoint';
import EditApiClient from './_Partials/createOrEdit';
import { useAlertDialog } from 'components/V2/AlertDialog';
import { MdOutlineRotateLeft } from 'react-icons/md';
import SuccessDialog from './_Partials/successDialog';
import { useDelete } from 'hooks/useDelete';

const CustomTable: any = Table;
const ApiClient = () => {
  const t: any = useTranslate();
  const { openDialog, closeDialog } = useDialog();
  const { showToast } = useToast();
  const { showAlert } = useAlertDialog();
  const { data: apiClients } = useList<IApiClientResource>(END_POINTS.API_CLIENT);
  const { mutate: updateApiClient } = useUpdate(`${END_POINTS.API_CLIENT}`);
  const { mutate: deleteApiClient } = useDelete(`${END_POINTS.API_CLIENT}`);

  const handleSwitchStatus = (id: number) => {
    showAlert({
      title: t('api_client.update_status.confirmation.title'),
      message: t('api_client.update_status.confirmation.message'),
      onConfirm: () => {
        updateApiClient({ id: `${id}/update-status`, payload: null }, {
          onSuccess: (res) => {
            showToast({
              title: t('api_client.update_status.toast.title.success'),
              message: t(res.message),
            });
          }
        });
      },
    });
  };

  const handleEdit = (apiClient: IApiClientResource) => {
    openDialog({
      title: t('api_client.edit.title'),
      content: <EditApiClient apiClient={apiClient} />
    });
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: t('api_client.delete.confirmation.title'),
      message: t('api_client.delete.confirmation.message'),
      onConfirm: () => {
        deleteApiClient(id, {
          onSuccess: (res) => {
            showToast({
              title: t('api_client.delete.toast.title.success'),
              message: t(res.message),
            });
          }
        });
      },
    });
  };

  const handleRegenerateSecretKey = (apiKey: string) => {
    showAlert({
      title: t('api_client.regenerate.secret_key.confirmation.title'),
      message: t('api_client.regenerate.secret_key.confirmation.message'),
      onConfirm: () => {
        updateApiClient({ id: `${apiKey}/generate-secret-key`, payload: null }, {
          onSuccess: (res) => {
            closeDialog();
            openDialog({
              title: t(res.message),
              content: <SuccessDialog apiKey={res.data.api_key} secretKey={res.data.secret_key} />,
              props: { size: 'lg' }
            });
          }
        });
      },
    });
  };

  const columns = useMemo(() => [
    { name: 'name', title: t('common.name') },
    { name: 'allow_ips', title: t('api_client.allow_ips') },
    { name: 'api_key', title: t('api_client.api_key') },
    { name: 'secret_key', title: t('api_client.secret_key') },
    { name: 'status', title: t('common.status') },
    { name: 'action', title: t('common.action') }
  ], [t]);

   const columnExtensions = [
    { columnName: 'api_key', wordWrapEnabled: false, width: 400 }
  ];

  const apiClientRows = useMemo(() => {
    return (apiClients?.data ?? []).map((ac) => {
      const action = (
        <>
          {ac.active
            ? <EnabledAction onClick={() => handleSwitchStatus(ac.id)} />
            : <DisabledAction onClick={() => handleSwitchStatus(ac.id)} />
          }
          <EditAction onClick={() => handleEdit(ac)} />
          <DeleteAction onClick={() => handleDelete(ac.id)} />
        </>
      );

      const allowIps = ac.allow_ips?.length ? ac.allow_ips.join(' / ') : null;
      const status = (
        <Badge pill variant={ac.active ? 'success' : 'danger'}>
          {ac.active ? t('common.active') : t('common.inactive')}
        </Badge>
      );
      const regenerateSecretKeyBtn = (
        <Button onClick={() => handleRegenerateSecretKey(ac.api_key)} size='sm' variant='outline-secondary'>
          <MdOutlineRotateLeft size={25}/> {t('api_client.regenerate.secret_key')}
        </Button>
      );

      return {
        name: ac.name,
        allow_ips: allowIps,
        api_key: ac.api_key,
        secret_key: regenerateSecretKeyBtn,
        status,
        action,
      };
    });
  }, [apiClients]);

  return (
    <div className="card">
      <CustomTable
        rows={apiClientRows}
        columns={columns}
        columnExtensions={columnExtensions}
        hideSearchFilter
        hidePagination
      />
    </div>
  );
};

export default ApiClient;

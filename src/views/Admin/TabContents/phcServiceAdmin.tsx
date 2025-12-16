import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import EnabledStatus from 'components/EnabledStatus';
import { EditAction, DeleteAction, EnabledAction, DisabledAction, MailSendAction } from 'components/V2/ActionIcons';
import * as moment from 'moment';
import settings from 'settings';
import { useList } from 'hooks/useList';
import EditPhcServiceAdmin from '../_Partials/PhcServiceAdminForm';
import useToast from 'components/V2/Toast';
import useDialog from 'components/V2/Dialog';
import { useAlertDialog } from 'components/V2/AlertDialog';
import { useDelete } from 'hooks/useDelete';
import { useMutationAction } from 'hooks/useMutationAction';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { useTranslate } from 'hooks/useTranslate';
import { END_POINTS } from 'variables/endPoint';
import { IUser } from 'interfaces/IUser';
import BasicTable from 'components/Table/basic';
import { USER_GROUPS } from 'variables/user';

const PhcServiceAdmin = () => {
  const dispatch = useDispatch();
  const t = useTranslate();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const { data: phcServiceAdmins } = useList<IUser>(END_POINTS.ADMIN, {
    admin_type: USER_GROUPS.PHC_SERVICE_ADMIN,
    search_value: searchValue,
    filters: filters,
    page_size: pageSize,
    page: currentPage + 1
  });
  const { mutate: deletePhcServiceAdmin } = useDelete(END_POINTS.ADMIN);
  const { mutate: updatePhcServiceAdminStatus } = useMutationAction(END_POINTS.ADMIN_UPDATE_STATUS);
  const { mutate: resendEmail } = useMutationAction(END_POINTS.ADMIN_RESEND_EMAIL);

  const columns = useMemo(() => [
    { name: 'last_name', title: t('common.last_name') },
    { name: 'first_name', title: t('common.first_name') },
    { name: 'email', title: t('common.email') },
    { name: 'phc_service', title: t('common.phc_service') },
    { name: 'status', title: t('common.status') },
    { name: 'last_login', title: t('common.last_login') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  useEffect(() => {
    if (phcServiceAdmins) {
      setTotalCount(phcServiceAdmins.info.total_count);
    }
  }, [phcServiceAdmins]);

  const handleSendMail = (id: number) => {
    resendEmail(
      { id, invalidateKeys: [END_POINTS.ADMIN] },
      {
        onSuccess: async (res) => {
          showToast({
            title: t('user.resend_email.toast_title'),
            message: t(res?.message),
            color: 'success'
          });
        }
      }
    );
  };

  const handleEdit = (phcServiceAdmin: IUser) => {
    openDialog({
      title: t('phc_service_admin.edit'),
      content: <EditPhcServiceAdmin phcServiceAdmin={phcServiceAdmin} />
    });
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: t('phc_service_admin.delete'),
      message: t('common.delete_confirmation_message'),
      onConfirm: () => { handleDeleteConfirm(id); }
    });
  };

  const handleDeleteConfirm = async (id: number) => {
    if (id) {
      dispatch(showSpinner(true));
      deletePhcServiceAdmin(
        id,
        {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            showToast({
              title: t('toast_title.delete_admin_account'),
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
    }
  };

  const handleSwitchStatus = (phcServiceAdmin: IUser) => {
    showAlert({
      title: t('user.switchStatus_confirmation_title'),
      message: t('common.switchStatus_confirmation_message'),
      onConfirm: () => { handleSwitchStatusConfirm(phcServiceAdmin.id, !phcServiceAdmin.enabled); }
    });
  };

  const handleSwitchStatusConfirm = async (id: number, enabled: boolean) => {
    if (id) {
      dispatch(showSpinner(true));
      updatePhcServiceAdminStatus(
        { id, payload: { enabled }, invalidateKeys: [END_POINTS.ADMIN] },
        {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            showToast({
              title: t('toast_title.rensend_admin_account'),
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
    }
  };

  const rows = useMemo(() =>
    (phcServiceAdmins?.data || []).map((phcServiceAdmin) => {
      const action = (
        <>
          {phcServiceAdmin.enabled
                ? <EnabledAction onClick={() => handleSwitchStatus(phcServiceAdmin)} />
                : <DisabledAction onClick={() => handleSwitchStatus(phcServiceAdmin)} />
              }
              <EditAction onClick={() => handleEdit(phcServiceAdmin)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(phcServiceAdmin.id)} disabled={phcServiceAdmin.enabled} />
              <MailSendAction onClick={() => handleSendMail(phcServiceAdmin.id)} disabled={phcServiceAdmin.last_login} />
        </>
      );

      return {
        last_name: phcServiceAdmin.last_name,
        first_name: phcServiceAdmin.first_name,
        email: phcServiceAdmin.email,
        phc_service: phcServiceAdmin.phc_service ? phcServiceAdmin.phc_service.name : '',
        status: <EnabledStatus enabled={!!phcServiceAdmin.enabled} />,
        last_login: phcServiceAdmin.last_login ? moment.utc(phcServiceAdmin.last_login).local().format(settings.datetime_format) : '',
        action
      };
    }),
    [phcServiceAdmins, handleEdit, handleDelete]
  );

  return (
    <div className="mt-3">
      <p>
        {t('common.phc_service_admin.management')}
      </p>
      <BasicTable
        showSearch={true}
        showPagination={true}
        showColumnChooser={true}
        showFilter={true}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        rows={rows}
      />
    </div>
  );
};

export default PhcServiceAdmin;

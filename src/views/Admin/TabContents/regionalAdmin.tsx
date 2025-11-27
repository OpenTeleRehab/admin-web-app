import EnabledStatus from 'components/EnabledStatus';
import BasicTable from 'components/Table/basic';
import { DeleteAction, DisabledAction, EditAction, EnabledAction, MailSendAction } from 'components/V2/ActionIcons';
import { useAlertDialog } from 'components/V2/AlertDialog';
import useDialog from 'components/V2/Dialog';
import useToast from 'components/V2/Toast';
import { useDelete } from 'hooks/useDelete';
import { useList } from 'hooks/useList';
import { useMutationAction } from 'hooks/useMutationAction';
import { useTranslate } from 'hooks/useTranslate';
import { IUser } from 'interfaces/IUser';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import settings from 'settings';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { END_POINTS } from 'variables/endPoint';
import { USER_GROUPS } from 'variables/user';
import EditRegionalAdmin from '../_Partials/RegionalAdminForm';

const RegionalAdmin = () => {
  const dispatch = useDispatch();
  const t = useTranslate();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const [pageSize, setPageSize] = useState<number>(60);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filters, setFilters] = useState([]);
  const { data: regionalAdmins } = useList<IUser>(END_POINTS.ADMIN, {
    admin_type: USER_GROUPS.REGIONAL_ADMIN,
    search_value: searchValue,
    filters: filters,
    page_size: pageSize,
    page: currentPage + 1
  });
  const { mutate: resendEmail } = useMutationAction(END_POINTS.ADMIN_RESEND_EMAIL);
  const { mutate: deletePhcServiceAdmin } = useDelete(END_POINTS.ADMIN);
  const { mutate: updateRegionalAdminStatus } = useMutationAction(END_POINTS.ADMIN_UPDATE_STATUS);

  useEffect(() => {
    if (regionalAdmins) {
      setTotalCount(regionalAdmins?.info?.total_count);
    }
  }, [regionalAdmins]);

  const columns = useMemo(() => [
    { name: 'last_name', title: t('common.last_name') },
    { name: 'first_name', title: t('common.first_name') },
    { name: 'email', title: t('common.email') },
    { name: 'region', title: t('common.region') },
    { name: 'status', title: t('common.status') },
    { name: 'last_login', title: t('common.last_login') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  const rows = useMemo(() =>
    (regionalAdmins?.data || []).map((regionalAdmin) => {
      const action = (
        <>
          {regionalAdmin.enabled
            ? <EnabledAction onClick={() => handleSwitchStatus(regionalAdmin)} />
            : <DisabledAction onClick={() => handleSwitchStatus(regionalAdmin)} />
          }
          <EditAction onClick={() => handleEdit(regionalAdmin)} />
          <DeleteAction className="ml-1" onClick={() => handleDelete(regionalAdmin.id)} disabled={regionalAdmin.enabled} />
          <MailSendAction onClick={() => handleSendMail(regionalAdmin.id)} disabled={regionalAdmin.last_login} />
        </>
      );

      return {
        last_name: regionalAdmin.last_name,
        first_name: regionalAdmin.first_name,
        email: regionalAdmin.email,
        region: regionalAdmin.region_name,
        status: <EnabledStatus enabled={!!regionalAdmin.enabled} />,
        last_login: regionalAdmin.last_login ? moment.utc(regionalAdmin.last_login).local().format(settings.datetime_format) : '',
        action
      };
    }),
    [regionalAdmins]
  );

  const handleSwitchStatus = (regionalAdmin: IUser) => {
    showAlert({
      title: t('user.switchStatus_confirmation_title'),
      message: t('common.switchStatus_confirmation_message'),
      onConfirm: () => { handleSwitchStatusConfirm(regionalAdmin.id, !regionalAdmin.enabled); }
    });
  };

  const handleSwitchStatusConfirm = async (id: number, enabled: boolean) => {
    if (id) {
      dispatch(showSpinner(true));
      updateRegionalAdminStatus(
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

  const handleEdit = (regionalAdmin: IUser) => {
    openDialog({
      title: t('regional_admin.edit'),
      content: <EditRegionalAdmin regionalAdmin={regionalAdmin} />
    });
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: t('regional_admin.delete'),
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

  return (
    <div className="mt-3">
      <p>
        {t('common.regional_admin.management')}
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

export default RegionalAdmin;

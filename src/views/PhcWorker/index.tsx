import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from 'components/Table';
import EnabledStatus from 'components/EnabledStatus';
import { DeleteAction, EditAction, EnabledAction, DisabledAction, MailSendAction } from 'components/V2/ActionIcons';
import CreateEditPhcWorker from './_Partials/createEdit';
import * as moment from 'moment';
import settings from 'settings';
import {
  getTotalOnGoingTreatment,
  getTotalPatient
} from 'utils/patient';
import { USER_ROLES } from '../../variables/user';
import { useKeycloak } from '@react-keycloak/web';
import _ from 'lodash';
import { getProfessionName } from 'utils/profession';
import customColorScheme from '../../utils/customColorScheme';
import { useTranslate } from 'hooks/useTranslate';
import { END_POINTS } from 'variables/endPoint';
import { useList } from 'hooks/useList';
import useDialog from 'components/V2/Dialog';
import useToast from 'components/V2/Toast';
import { useAlertDialog } from 'components/V2/AlertDialog';
import { useOne } from 'hooks/useOne';
import { useMutationAction } from 'hooks/useMutationAction';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { IPhcWorker } from 'interfaces/IPhcWorker';

const PhcWorker = () => {
  const dispatch = useDispatch();
  const t = useTranslate();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const { keycloak } = useKeycloak();
  const countries = useSelector((state: any) => state.country.countries);
  const clinics = useSelector((state: any) => state.clinic.clinics);
  const { profile } = useSelector((state: any) => state.auth);
  const { colorScheme } = useSelector((state: any) => state.colorScheme);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  // TODO: fetch patients by phcWorker
  const patients: any = [];

  const { data: phcWorkers } = useList<IPhcWorker>(END_POINTS.PHC_WORKERS,
    {
      phc_service_id: profile ? profile.phc_service_id : null,
      country_id: profile ? profile.country_id : null,
      region_id: profile ? profile.region_id : null,
      filters,
      search_value: searchValue,
      user_type: profile.type,
      page_size: pageSize,
      page: currentPage + 1
   }
  );
  const { data: professions } = useList<any>(END_POINTS.PROFESSIONS);
  const { data: totalPhcWorkers } = useOne<any>(END_POINTS.COUNT_PHC_WORKER_BY_PHC_SERVICE, null, { enabled: true });
  const { mutate: updatePhcWorkerStatus } = useMutationAction(END_POINTS.PHC_WORKERS_UPDATE_STATUS);
  const { mutate: resendEmail } = useMutationAction(END_POINTS.PHC_WORKERS_RESEND_EMAIL);
  const { mutate: deletePhcWorker } = useMutationAction(END_POINTS.PHC_WORKERS_DELETE);

  const PhcWorkerListTable = CustomTable as any;

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    if (phcWorkers) {
      setTotalCount(phcWorkers.total_count);
    }
  }, [currentPage, pageSize, searchValue, filters, profile]);

  const columns = useMemo(() => [
    { name: 'id', title: t('common.id') },
    { name: 'last_name', title: t('common.last_name') },
    { name: 'first_name', title: t('common.first_name') },
    { name: 'email', title: t('common.email') },
    { name: 'total_patient', title: t('common.total_patient') },
    { name: 'assigned_patient', title: t('common.assigned_patient') },
    { name: 'limit_patient', title: t('common.on_going.treatment_let') },
    { name: 'status', title: t('common.status') },
    { name: 'last_login', title: t('common.last_login') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  const columnExtensions = [
    { columnName: 'id', wordWrapEnabled: true, width: 250 },
    { columnName: 'last_name', wordWrapEnabled: true },
    { columnName: 'first_name', wordWrapEnabled: true },
    { columnName: 'limit_patient', wordWrapEnabled: true },
    { columnName: 'last_login', wordWrapEnabled: true, width: 250 },
    { columnName: 'total_patient', wordWrapEnabled: true },
    { columnName: 'assigned_patient', wordWrapEnabled: true },
    { columnName: 'on_going_treatment', wordWrapEnabled: true }
  ];

  const handleCreate = () => {
    openDialog({
      title: t('phc_worker.new'),
      content: <CreateEditPhcWorker/>,
      props: { size: 'lg' }
    });
  };

  const handleEdit = (phcWorker: IPhcWorker) => {
    openDialog({
      title: t('phc_worker.edit'),
      content: <CreateEditPhcWorker phcWorker={phcWorker} />,
      props: { size: 'lg' }
    });
  };

  const handleSwitchStatus = (phcWorker: IPhcWorker) => {
    showAlert({
      title: t('user.switchStatus_confirmation_title'),
      message: t('common.switchStatus_confirmation_message'),
      onConfirm: () => { handleConfirmUpdateStatus(phcWorker.id, !phcWorker.enabled); }
    });
  };

  const handleConfirmUpdateStatus = (id: number, enabled: boolean) => {
    updatePhcWorkerStatus(
      { id, payload: { enabled }, invalidateKeys: [END_POINTS.PHC_WORKERS] },
      {
        onSuccess: async (res) => {
          dispatch(showSpinner(false));
          showToast({
            title: t('user.switchStatus_confirmation_title'),
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
  };

  const handleSendMail = (id: number) => {
    resendEmail(
      { id, invalidateKeys: [END_POINTS.PHC_WORKERS] },
      {
        onSuccess: async (res) => {
          showToast({
            title: t('toast_title.rensend_admin_account'),
            message: t(res?.message),
            color: 'success'
          });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: t('phc_worker.delete'),
      message: t('common.delete_confirmation_message'),
      onConfirm: () => { handleDeleteConfirm(id); }
    });
  };

  const handleDeleteConfirm = async (id: number) => {
    if (id) {
      dispatch(showSpinner(true));
      deletePhcWorker(
        { id, invalidateKeys: [END_POINTS.PHC_WORKERS] },
        {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            showToast({
              title: t('phc_worker.delete'),
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
    (phcWorkers?.data || []).map(phcWorker => {
      const action = (
        <>
          {keycloak.hasRealmRole(USER_ROLES.MANAGE_PHC_WORKER) && (
            // TODO: Disable enabled/disabled action if have patients as in therapist
            <>
              {phcWorker.enabled
                ? <EnabledAction onClick={() => handleSwitchStatus(phcWorker)} />
                : <DisabledAction onClick={() => handleSwitchStatus(phcWorker)} />
              }
              <EditAction onClick={() => handleEdit(phcWorker)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(phcWorker.id)} />
              <MailSendAction onClick={() => handleSendMail(phcWorker.id)} disabled={phcWorker.last_login} />
            </>
          )}
        </>
      );

      return {
        id: phcWorker.identity,
        first_name: phcWorker.first_name,
        last_name: phcWorker.last_name,
        email: phcWorker.email,
        profession: getProfessionName(phcWorker.profession_id, professions?.data || []),
        total_patient: getTotalPatient(phcWorker.id, patients),
        on_going_treatment: getTotalOnGoingTreatment(phcWorker.id, patients),
        assigned_patient: getTotalOnGoingTreatment(phcWorker.id, patients),
        limit_patient: phcWorker.limit_patient,
        status: <EnabledStatus enabled={phcWorker.enabled} />,
        last_login: phcWorker.last_login ? moment.utc(phcWorker.last_login).local().format(settings.datetime_format) : '',
        action
      };
    }),
    [phcWorkers, handleEdit, handleSendMail, handleSwitchStatus, countries, clinics, professions, patients]
  );

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{t('phc_worker.list')}</h1>
        {totalPhcWorkers && totalPhcWorkers < (profile?.phc_service?.phc_worker_limit ?? 0) && (
          <div className="btn-toolbar mb-2 mb-md-0">
            <Button variant="primary" onClick={handleCreate}>
              <BsPlus size={20} className="mr-1" />
              {t('phc_worker.new')}
            </Button>
          </div>
        )}
      </div>

      <PhcWorkerListTable
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        columnExtensions={columnExtensions}
        rows={rows}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default PhcWorker;

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
  getTotalOnGoingTreatmentByPhcWorker,
  getTotalPatientByPhcWorker
} from 'utils/patient';
import { USER_GROUPS, USER_ROLES } from '../../variables/user';
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
import { checkFederatedUser } from 'utils/user';
import { getCountryName } from 'utils/country';
import DeletePhcWorker from './_Partials/delete';
import { getRegionName } from 'utils/region';
import { getPhcServiceName } from 'utils/phcService';

const PhcWorker = () => {
  const dispatch = useDispatch();
  const t = useTranslate();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const { keycloak } = useKeycloak();
  const countries = useSelector((state: any) => state.country.countries);
  const { profile } = useSelector((state: any) => state.auth);
  const { colorScheme } = useSelector((state: any) => state.colorScheme);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const { data: phcWorkers } = useList<IPhcWorker>(END_POINTS.PHC_WORKERS,
    {
      phc_service_id: profile?.phc_service?.id ?? null,
      country_id: profile?.country_id ?? null,
      region_id: profile?.region_id ?? null,
      filters,
      search_value: searchValue,
      user_type: profile.type,
      page_size: pageSize,
      page: currentPage + 1
    }
  );
  const { data: patients } = useList(END_POINTS.PATIENT_LIST_BY_PHC_WORKER_IDS,
    { phc_worker_ids: phcWorkers?.data?.map((pw) => pw.id) },
    { enabled: (phcWorkers?.data ?? []).length > 0 }
  );
  const { data: professions } = useList<any>(END_POINTS.PROFESSIONS);
  const { data: { data: regions = [] } = {} } = useList(END_POINTS.REGION, {}, { enabled: keycloak.hasRealmRole(USER_ROLES.VIEW_REGION_LIST) });
  const { data: { data: phcServices = [] } = {} } = useList(END_POINTS.PHC_SERVICES_OPTION_LIST, {}, { enabled: keycloak.hasRealmRole(USER_ROLES.VIEW_PHC_SERVICE_LIST) });
  const { data: totalPhcWorkers } = useOne<any>(END_POINTS.COUNT_PHC_WORKER_BY_PHC_SERVICE, null, { enabled: keycloak.hasRealmRole(USER_ROLES.MANAGE_PHC_WORKER) });
  const { mutate: updatePhcWorkerStatus } = useMutationAction(END_POINTS.PHC_WORKERS_UPDATE_STATUS);
  const { mutate: resendEmail } = useMutationAction(END_POINTS.PHC_WORKERS_RESEND_EMAIL);

  const PhcWorkerListTable = CustomTable as any;

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters]);

  useEffect(() => {
    if (phcWorkers) {
      setTotalCount(phcWorkers.total_count);
    }
  }, [currentPage, pageSize, searchValue, filters, profile]);

  let columns = useMemo(() => [
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

  if (profile?.type === USER_GROUPS.ORGANIZATION_ADMIN || profile?.type === USER_GROUPS.COUNTRY_ADMIN || profile?.type === USER_GROUPS.REGIONAL_ADMIN) {
    columns = useMemo(() => [
      { name: 'id', title: t('common.id') },
      { name: 'profession', title: t('common.profession') },
      { name: (profile?.type === USER_GROUPS.COUNTRY_ADMIN || profile?.type === USER_GROUPS.REGIONAL_ADMIN) ? 'phc_worker_country' : 'country', title: t('common.country') },
      { name: profile?.type === USER_GROUPS.REGIONAL_ADMIN ? 'phc_worker_region' : 'region', title: t('common.region') },
      { name: 'phc_service', title: t('common.phc_service') },
      { name: 'total_patient', title: t('common.total_patient') },
      { name: 'on_going_treatment', title: t('common.ongoing_treatment_plan') },
      { name: 'limit_patient', title: t('common.on_going.treatment_let') },
      { name: 'action', title: t('common.action') }
    ], [t]);
  }

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
      content: <CreateEditPhcWorker/>
    });
  };

  const handleEdit = (phcWorker: IPhcWorker) => {
    openDialog({
      title: t('phc_worker.edit'),
      content: <CreateEditPhcWorker phcWorker={phcWorker} />
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

  const handleDelete = (phcWorker: IPhcWorker) => {
    openDialog({
      title: t('phc_worker.delete'),
      content: <DeletePhcWorker phcWorker={phcWorker} />,
    });
  };

  const rows = useMemo(() =>
    (phcWorkers?.data || []).map(phcWorker => {
      const isFederatedUser = checkFederatedUser(phcWorker.email);
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
              <DeleteAction className="ml-1" onClick={() => handleDelete(phcWorker)} />
              {!isFederatedUser && <MailSendAction onClick={() => handleSendMail(phcWorker.id)} disabled={phcWorker.last_login} />}
            </>
          )}
          {keycloak.hasRealmRole(USER_ROLES.DELETE_PHC_WORKER) && (
            <DeleteAction className="ml-1" onClick={() => handleDelete(phcWorker)} />
          )}
        </>
      );

      return {
        id: phcWorker.identity,
        first_name: phcWorker.first_name,
        last_name: phcWorker.last_name,
        email: phcWorker.email,
        profession: getProfessionName(phcWorker.profession_id, professions?.data || []),
        country: getCountryName(phcWorker.country_id, countries),
        phc_worker_country: getCountryName(phcWorker.country_id, countries),
        region: getRegionName(phcWorker.region_id, regions),
        phc_worker_region: getRegionName(phcWorker.region_id, regions),
        phc_service: getPhcServiceName(phcWorker.phc_service_id, phcServices),
        total_patient: getTotalPatientByPhcWorker(phcWorker.id, patients?.data),
        on_going_treatment: getTotalOnGoingTreatmentByPhcWorker(phcWorker.id, patients?.data),
        assigned_patient: getTotalOnGoingTreatmentByPhcWorker(phcWorker.id, patients?.data),
        limit_patient: phcWorker.limit_patient,
        status: <EnabledStatus enabled={phcWorker.enabled} />,
        last_login: phcWorker.last_login ? moment.utc(phcWorker.last_login).local().format(settings.datetime_format) : '',
        action
      };
    }),
    [phcWorkers, handleEdit, handleSendMail, handleSwitchStatus, countries, regions, phcServices, professions, patients]
  );

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{t('phc_worker.list')}</h1>
        {totalPhcWorkers != null && totalPhcWorkers < (profile?.phc_service?.phc_worker_limit ?? 0) && (
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

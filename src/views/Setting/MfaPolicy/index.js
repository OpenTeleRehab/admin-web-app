import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { useJobStatuses } from 'hooks/useJobStatus';
import { Badge, Spinner } from 'react-bootstrap';
import BasicTable from 'components/Table/basic';
import { JOB_STATUS } from 'variables/jobStatus';
import CreateMfaPolicy from './create';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import { getMfaSettings } from 'store/mfaSetting/actions';
import { USER_GROUPS } from 'variables/user';
import customColorScheme from 'utils/customColorScheme';
import { useDelete } from 'hooks/useDelete';
import { useAlertDialog } from 'components/V2/AlertDialog';
import { showSpinner } from 'store/spinnerOverlay/actions';
import useToast from 'components/V2/Toast';
import useDialog from 'components/V2/Dialog';
import _ from 'lodash';

const MfaPolicy = ({ translate }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);
  const mfaSettings = useSelector(state => state.mfaSetting.mfaSettings);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [showEdit, setShowEdit] = useState(false);
  const [editingMfa, setEditingMfa] = useState(null);
  const [rows, setRows] = useState([]);
  const { mutate: deleteMfa } = useDelete('mfa-settings');
  const { showAlert } = useAlertDialog();
  const { showToast } = useToast();
  const { closeDialog } = useDialog();

  const jobIds = useMemo(
    () => mfaSettings ? mfaSettings.map(mfa => mfa.job_status && mfa.job_status.job_id) : [],
    [mfaSettings]
  );

  const jobStatuses = useJobStatuses(jobIds);

  useEffect(() => {
    dispatch(getMfaSettings());
  }, []);

  useEffect(() => {
    if (!mfaSettings) return;

    setRows(
      mfaSettings.map((mfaSetting) => ({
        ...mfaSetting,
        progress_status: jobStatuses[mfaSetting.job_status.job_id] || JOB_STATUS.RUNNING
      }))
    );
  }, [mfaSettings, jobStatuses]);

  const columns = useMemo(() => [
    { name: 'role', title: translate('mfa.user_type') },
    ...(![USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.REGIONAL_ADMIN, USER_GROUPS.CLINIC_ADMIN, USER_GROUPS.PHC_SERVICE_ADMIN].includes(profile.type)
      ? [{ name: 'organizations', title: translate('mfa.organizations') }]
      : []),

    ...(![USER_GROUPS.SUPER_ADMIN, USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.REGIONAL_ADMIN, USER_GROUPS.CLINIC_ADMIN, USER_GROUPS.PHC_SERVICE_ADMIN].includes(profile.type)
      ? [{ name: 'countries', title: translate('mfa.countries') }]
      : []),

    ...(![USER_GROUPS.SUPER_ADMIN, USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.CLINIC_ADMIN, USER_GROUPS.PHC_SERVICE_ADMIN].includes(profile.type)
      ? [{ name: 'regions', title: translate('mfa.regions') }]
      : []),

    ...(![USER_GROUPS.SUPER_ADMIN, USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.CLINIC_ADMIN, USER_GROUPS.PHC_SERVICE_ADMIN].includes(profile.type))
      ? [{ name: 'clinics', title: translate('mfa.services') }]
      : [],

    ...(![USER_GROUPS.SUPER_ADMIN, USER_GROUPS.ORGANIZATION_ADMIN, USER_GROUPS.COUNTRY_ADMIN, USER_GROUPS.CLINIC_ADMIN, USER_GROUPS.PHC_SERVICE_ADMIN].includes(profile.type)
      ? [{ name: 'phc_services', title: translate('mfa.phc_services') }]
      : []),

    { name: 'attributes', title: translate('mfa.configs') },
    { name: 'progress_status', title: translate('mfa.status') },
    { name: 'action', title: translate('common.action') }
  ], [translate]);

  const handleEdit = (record) => {
    setEditingMfa(record);
    setShowEdit(true);
  };

  const handleDelete = (id) => {
    showAlert({
      title: translate('mfa.delete_confirmation.title'),
      message: translate('mfa.delete_confirmation.message'),
      closeOnConfirm: false,
      onConfirm: () => {
        dispatch(showSpinner(true));
        deleteMfa(id, {
          onSuccess: (res) => {
            dispatch(showSpinner(false));
            dispatch(getMfaSettings());
            closeDialog();
            showToast({
              title: translate('mfa.toast_title.delete'),
              message: translate(res?.message),
              color: 'success'
            });
          },
          onError: () => {
            dispatch(showSpinner(false));
          }
        });
      }
    });
  };

  return (
    <>
      <div className='no-gutters bg-white p-md-3'>
        <BasicTable
          rows={rows.map(mfaSetting => {
            const action = (
              <div className='d-flex justify-content-center'>
                <EditAction onClick={() => handleEdit(mfaSetting)} disabled={mfaSetting.progress_status === JOB_STATUS.RUNNING || !!mfaSetting.deleted_at} />
                <DeleteAction onClick={() => handleDelete(mfaSetting.id)} disabled={mfaSetting.progress_status === JOB_STATUS.RUNNING || !!mfaSetting.deleted_at} />
              </div>
            );

            return {
              role: <Translate id={`common.${mfaSetting.role}`} />,
              organizations: mfaSetting.organizations_name.join(', '),
              countries: mfaSetting.countries.join(', '),
              regions: mfaSetting.regions?.join(', '),
              clinics: mfaSetting.clinics.join(', '),
              phc_services: mfaSetting.phc_services?.join(', '),
              attributes: (
                <ul style={{ paddingLeft: '1rem', marginTop: 0, marginBottom: 0 }}>
                  <li>
                    <strong>{translate('mfa.mfa_enforcement')}</strong>:{' '}
                    <Translate id={`mfa.enforcement.${mfaSetting.mfa_enforcement}`} />
                  </li>
                  {mfaSetting && mfaSetting.mfa_expiration_duration && (
                    <li>
                      <strong>{translate('mfa.mfa_expiration_duration')}</strong>: {mfaSetting.mfa_expiration_duration} {mfaSetting.mfa_expiration_unit}
                    </li>
                  )}
                  {mfaSetting && mfaSetting.skip_mfa_setup_duration && (
                    <li>
                      <strong>{translate('mfa.skip_mfa_setup_duration')}</strong>: {mfaSetting.skip_mfa_setup_duration} {mfaSetting.skip_mfa_setup_unit}
                    </li>
                  )}
                </ul>
              ),
              progress_status: mfaSetting.progress_status === JOB_STATUS.COMPLETED ? (
                <Badge pill variant="success">
                  {mfaSetting.deleted_at ? translate('mfa.progress.status.deleted') : translate('mfa.progress.status.completed')}
                </Badge>
              ) : mfaSetting.progress_status === JOB_STATUS.FAILED ? (
                <Badge pill variant="danger">
                  {translate('mfa.progress.status.failed')}
                </Badge>
              ) : (
                <Spinner animation="border" size="sm" variant="primary" />
              ),
              action
            };
          })}
          columns={columns}
        />
      </div>

      {showEdit && editingMfa && (
        <CreateMfaPolicy
          show={showEdit}
          handleClose={() => setShowEdit(false)}
          initialData={editingMfa}
        />
      )}
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

MfaPolicy.propTypes = {
  translate: PropTypes.func
};

export default MfaPolicy;

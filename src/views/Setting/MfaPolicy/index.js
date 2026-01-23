import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { useJobStatuses } from 'hook/useJobStatus';
import { Badge, Spinner } from 'react-bootstrap';
import BasicTable from 'components/Table/basic';
import { JOB_STATUS } from 'variables/jobStatus';
import CreateMfaPolicy from './create';
import { EditAction } from 'components/ActionIcons';
import { getMfaSettings } from 'store/mfaSetting/actions';
import { USER_GROUPS } from 'variables/user';

const MfaPolicy = ({ translate }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);
  const mfaSettings = useSelector(state => state.mfaSetting.mfaSettings);
  const [showEdit, setShowEdit] = useState(false);
  const [editingMfa, setEditingMfa] = useState(null);
  const [rows, setRows] = useState([]);

  const jobIds = useMemo(
    () => mfaSettings ? mfaSettings.map(mfa => mfa.job_status && mfa.job_status.job_id) : [],
    [mfaSettings]
  );

  const jobStatuses = useJobStatuses(jobIds);

  useEffect(() => {
    dispatch(getMfaSettings());
  }, []);

  useEffect(() => {
    if (mfaSettings && mfaSettings.length) {
      setRows(
        mfaSettings.map((mfaSetting) => ({
          ...mfaSetting,
          progress_status: !mfaSetting.job_status
            ? JOB_STATUS.COMPLETED
            : jobStatuses[mfaSetting.job_status.job_id] || JOB_STATUS.RUNNING
        }))
      );
    }
  }, [mfaSettings, jobStatuses]);

  const columns = useMemo(() => {
    let cols = [
      { name: 'role', title: translate('mfa.user_type') },
      { name: 'organizations', title: translate('mfa.organizations') },
      { name: 'countries', title: translate('mfa.countries') },
      { name: 'clinics', title: translate('mfa.services') },
      { name: 'attributes', title: translate('mfa.configs') },
      { name: 'progress_status', title: translate('mfa.status') },
      { name: 'action', title: translate('common.action') }
    ];

    if (profile.type === USER_GROUPS.SUPER_ADMIN) {
      cols = cols.filter(col => col.name !== 'countries');
    }

    if (profile.type === USER_GROUPS.ORGANIZATION_ADMIN || profile.type === USER_GROUPS.SUPER_ADMIN) {
      cols = cols.filter(col => col.name !== 'clinics');
    }

    return cols;
  }, [translate, profile.type]);

  const handleEdit = (record) => {
    setEditingMfa(record);
    setShowEdit(true);
  };

  return (
    <>
      <div className='no-gutters bg-white p-md-3'>
        <BasicTable
          rows={rows.map(mfaSetting => {
            const action = (
              <div className='d-flex justify-content-center'>
                <EditAction onClick={() => handleEdit(mfaSetting)} />
              </div>
            );

            return {
              role: <Translate id={`common.${mfaSetting.role}`} />,
              organizations: mfaSetting.organizations_name.join(', '),
              countries: mfaSetting.countries.join(', '),
              clinics: mfaSetting.clinics.join(', '),
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
                  {translate('mfa.progress.status.completed')}
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
    </>
  );
};

MfaPolicy.propTypes = {
  translate: PropTypes.func
};

export default MfaPolicy;

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMfaSettings, getMfaSettingsUserResources } from 'store/mfaSetting/actions';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { useJobStatuses } from 'hook/useJobStatus';
import { Badge, Spinner } from 'react-bootstrap';
import BasicTable from 'components/Table/basic';
import { JOB_STATUS } from 'variables/jobStatus';
import CreateMfaPolicy from './create';
import { EditAction } from 'components/ActionIcons';

let timer = null;

const MfaPolicy = ({ translate }) => {
  const dispatch = useDispatch();
  const mfaSettings = useSelector(state => state.mfaSetting.mfaSettings);
  const organizations = useSelector((state) => state.organization.organizations);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);

  const [showEdit, setShowEdit] = useState(false);
  const [editingMfa, setEditingMfa] = useState(null);
  const [rows, setRows] = useState([]);

  const jobIds = useMemo(
    () => mfaSettings ? mfaSettings.map(mfa => mfa.job_status && mfa.job_status.job_id) : [],
    [mfaSettings]
  );

  const jobStatuses = useJobStatuses(jobIds);

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

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getMfaSettings());
      dispatch(getMfaSettingsUserResources());
    }, 500);
  }, [dispatch]);

  const columns = [
    { name: 'role', title: translate('mfa.user_type') },
    { name: 'organizations', title: translate('mfa.organizations') },
    { name: 'countries', title: translate('mfa.countries') },
    { name: 'clinics', title: translate('mfa.services') },
    { name: 'attributes', title: translate('mfa.configs') },
    { name: 'progress_status', title: translate('mfa.status') },
    { name: 'action', title: translate('common.action') }
  ];

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
              organizations: organizations
                .filter(org => Array.isArray(mfaSetting.organizations) && mfaSetting.organizations.includes(org.id))
                .map(org => org.name)
                .join(', '),
              countries: countries
                .filter(c => Array.isArray(mfaSetting.countries) && mfaSetting.countries.includes(c.id))
                .map(c => c.name)
                .join(', '),
              clinics: clinics
                .filter(c => Array.isArray(mfaSetting.clinics) && mfaSetting.clinics.includes(c.id))
                .map(c => c.name)
                .join(', '),
              attributes: (
                <ul style={{ paddingLeft: '1rem', marginTop: 0, marginBottom: 0 }}>
                  {mfaSetting.attributes &&
                    Object.entries(mfaSetting.attributes).map(([key, value]) => (
                      <li key={key}>
                        <strong>{translate(`mfa.${key}`)}</strong>:{' '}
                        {key === 'mfa_enforcement'
                          ? <Translate id={`mfa.enforcement.${value}`} />
                          : String(value)}
                      </li>
                    ))}
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

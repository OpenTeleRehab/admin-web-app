import React, { useEffect, useState, useMemo } from 'react';
import CustomTable from 'components/Table';
import settings from 'settings';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { PLATFORMS } from '../../../variables/platform';
import { useSelector } from 'react-redux';
import { getCountryISO } from 'utils/country';
import { USER_GROUPS } from '../../../variables/user';

const AuditLogList = ({ translate, platform, countryId }) => {
  const { countries } = useSelector(state => state.country);
  const { profile } = useSelector(state => state.auth);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  const { data: { data: auditLogs = [], info } = {} } = useList(platform === PLATFORMS.ADMIN_PORTAL ? END_POINTS.AUDIT_LOG : platform === PLATFORMS.THERAPIST_PORTAL ? END_POINTS.THERAPIST_AUDIT_LOG : END_POINTS.PATIENT_AUDIT_LOG, {
    page_size: pageSize,
    page: currentPage + 1,
    search_value: searchValue,
    filters: filters,
    country_id: countryId
  }, {}, { country: getCountryISO(countryId, countries) });

  useEffect(() => {
    if (info) {
      setTotalCount(info.total_count);
    }
  }, [info]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue, filters, platform, countryId]);

  const allColumns = [
    { name: 'type_of_changes', title: translate('audit_logs.type_of_changes') },
    { name: 'who', title: translate('audit_logs.who') },
    { name: 'user_group', title: translate('audit_logs.user_groups') },
    { name: 'country', title: translate('common.country') },
    { name: 'region', title: translate('common.region') },
    { name: 'province', title: translate('common.province') },
    { name: 'clinic', title: translate('common.clinic') },
    { name: 'phc_service', title: translate('common.phc_service') },
    { name: 'date_time', title: translate('audit_logs.date_time') },
    { name: 'subject_type', title: translate('audit_logs.object_type') },
    { name: 'before_changed', title: translate('audit_logs.before_changed') },
    { name: 'after_changed', title: translate('audit_logs.after_changed') }
  ];

  const hiddenColumnsByRole = {
    [USER_GROUPS.COUNTRY_ADMIN]: ['country'],
    [USER_GROUPS.REGIONAL_ADMIN]: ['country'],
    [USER_GROUPS.CLINIC_ADMIN]: ['country', 'region', 'phc_service', 'clinic', 'province'],
    [USER_GROUPS.PHC_SERVICE_ADMIN]: ['country', 'region', 'clinic', 'phc_service', 'province'],
  };

  const columns = useMemo(() => {
    const hiddenColumns = hiddenColumnsByRole[profile.type] || [];
    return allColumns.filter(col => !hiddenColumns.includes(col.name));
  }, [profile.type, translate]);

  const columnExtensions = [
    { columnName: 'who', wordWrapEnabled: true, width: 200 },
    { columnName: 'region', wordWrapEnabled: true, width: 200 },
    { columnName: 'date_time', wordWrapEnabled: true, width: 200 },
    { columnName: 'before_changed', wordWrapEnabled: true, width: 250 },
    { columnName: 'after_changed', wordWrapEnabled: true, width: 250 }
  ];

  const renderChangedItems = (item) => (
    <ul>
      {
        Object.keys(item).map(key => (
          <li key={key}>
            {key} : {JSON.stringify(item[key])}
          </li>
        ))
      }
    </ul>
  );

  return (
    <CustomTable
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
      rows={auditLogs.map(auditLog => {
        return {
          type_of_changes: translate(`common.${auditLog.type_of_changes}`),
          user_group: translate(`common.${auditLog.user_group}`),
          who: auditLog.who,
          country: auditLog.country,
          region: auditLog.region,
          province: auditLog.province,
          clinic: auditLog.clinic,
          phc_service: auditLog.phc_service,
          subject_type: auditLog.subject_type,
          date_time: auditLog.date_time ? moment.utc(auditLog.date_time).local().format(settings.datetime_format) : '',
          before_changed: auditLog.before_changed ? renderChangedItems(auditLog.before_changed) : '',
          after_changed: renderChangedItems(auditLog.after_changed)
        };
      })}
    />
  );
};

AuditLogList.propTypes = {
  translate: PropTypes.func,
  platform: PropTypes.string,
  countryId: PropTypes.number
};

export default AuditLogList;

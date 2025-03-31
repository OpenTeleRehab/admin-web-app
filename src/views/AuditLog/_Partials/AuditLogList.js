import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from 'components/Table';
import settings from 'settings';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { getAuditLogs } from 'store/auditLog/actions';

let timer = null;
const AuditLogList = ({ translate }) => {
  const dispatch = useDispatch();
  const auditLogs = useSelector(state => state.auditLog.auditLogs);
  const columns = [
    { name: 'type_of_changes', title: translate('audit_logs.type_of_changes') },
    { name: 'who', title: translate('audit_logs.who') },
    { name: 'user_group', title: translate('audit_logs.user_groups') },
    { name: 'country', title: translate('common.country') },
    { name: 'clinic', title: translate('common.clinic') },
    { name: 'date_time', title: translate('audit_logs.date_time') },
    { name: 'subject_type', title: translate('audit_logs.object_type') },
    { name: 'before_changed', title: translate('audit_logs.before_changed') },
    { name: 'after_changed', title: translate('audit_logs.after_changed') }
  ];
  const columnExtensions = [
    { columnName: 'who', wordWrapEnabled: true, width: 200 },
    { columnName: 'date_time', wordWrapEnabled: true, width: 200 },
    { columnName: 'before_changed', wordWrapEnabled: true, width: 250 },
    { columnName: 'after_changed', wordWrapEnabled: true, width: 250 }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(
        getAuditLogs({
          page_size: pageSize,
          page: currentPage + 1,
          search_value: searchValue,
          filters: filters
        })
      ).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }, 500);
  }, [currentPage, pageSize, dispatch, searchValue, filters]);

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
          clinic: auditLog.clinic,
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
  translate: PropTypes.func
};

export default AuditLogList;

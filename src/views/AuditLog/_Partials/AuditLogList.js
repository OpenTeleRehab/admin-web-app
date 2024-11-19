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
    { name: 'date_time', title: translate('audit_logs.date_time') },
    { name: 'before_changed', title: translate('audit_logs.before_changed') },
    { name: 'after_changed', title: translate('audit_logs.after_changed') }
  ];
  const columnExtensions = [
    { columnName: 'before_changed', wordWrapEnabled: true, width: 250 },
    { columnName: 'after_changed', wordWrapEnabled: true, width: 250 }
  ];

  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(
        getAuditLogs({
          page_size: pageSize,
          page: currentPage + 1
        })
      ).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    });
  }, [currentPage, pageSize, dispatch]);

  const renderChangedItems = item => (
    <ul>
      {
        Object.keys(item).map(key =>
          <li key={key}>{key} : {item[key]}</li>
        )
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
      hideSearchFilter={true}
      columns={columns}
      columnExtensions={columnExtensions}
      rows={auditLogs.map(auditLog => {
        return {
          type_of_changes: auditLog.type_of_changes,
          who: auditLog.who,
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

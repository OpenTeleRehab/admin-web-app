import React from 'react';
import { getTranslate } from 'react-localize-redux';
import AuditLogList from './_Partials/AuditLogList';
import { useSelector } from 'react-redux';

const AuditLog = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1>{translate('audit_logs')}</h1>
        <div className="btn-toolbar mb-2 mb-md-0"></div>
      </div>
      <AuditLogList translate={translate} />
    </div>
  );
};

export default AuditLog;

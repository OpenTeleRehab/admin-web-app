const getAuditLogsRequest = () => ({
  type: 'GET_AUDIT_LOGS_REQUEST'
});

const getAuditLogsSuccess = (data, filters) => ({
  type: 'GET_AUDIT_LOGS_SUCCESS',
  data,
  filters
});

const getAuditLogsFail = () => ({
  type: 'GET_AUDIT_LOGS_FAIL'
});

export const mutation = {
  getAuditLogsRequest,
  getAuditLogsSuccess,
  getAuditLogsFail
};

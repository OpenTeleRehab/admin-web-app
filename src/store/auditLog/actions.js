import { AuditLog } from 'services/auditLog';
import { mutation } from './mutations';

import { showErrorNotification } from 'store/notification/actions';
import { showSpinner } from 'store/spinnerOverlay/actions';

// Actions
export const getAuditLogs = payload => async dispatch => {
  dispatch(mutation.getAuditLogsRequest());
  dispatch(showSpinner(true));
  const data = await AuditLog.getAuditLogs(payload);

  if (data.success) {
    dispatch(mutation.getAuditLogsSuccess(data.data, payload));
    dispatch(showSpinner(false));
    return data.info;
  } else {
    dispatch(mutation.getAuditLogsFail());
    dispatch(showSpinner(false));
    if (data.message) {
      dispatch(showErrorNotification('toast_title.error_message', data.message));
    }
  }
};

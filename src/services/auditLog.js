import customAxios from 'utils/axios';
import axios from 'axios';

window.getUserAxiosCancel = undefined;
const CancelToken = axios.CancelToken;

const getAuditLogs = payload => {
  if (window.getUserAxiosCancel !== undefined) {
    window.getUserAxiosCancel();
  }
  return customAxios.get('/audit-logs', {
    params: payload,
    cancelToken: new CancelToken(function executor (c) {
      window.getUserAxiosCancel = c;
    })
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    if (e.response && e.response.data) {
      return e.response.data;
    } else {
      return { success: false };
    }
  });
};

export const AuditLog = {
  getAuditLogs
};

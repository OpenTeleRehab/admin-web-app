import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGuestToken } from 'store/superset/actions';
import { embedDashboard } from '@superset-ui/embedded-sdk';

const CountryAdminDashboard = () => {
  const dispatch = useDispatch();
  const { guestToken } = useSelector(state => state.superset);

  useEffect(() => {
    if (guestToken) {
      embedDashboard({
        id: process.env.REACT_APP_SUPERSET_DASHBOARD_ID_FOR_COUNTRY_ADMIN,
        supersetDomain: process.env.REACT_APP_SUPERSET_API_BASE_URL,
        mountPoint: document.getElementById('superset-container'),
        fetchGuestToken: () => guestToken,
        dashboardUiConfig: {
          hideTitle: true,
          filters: {
            expanded: true
          }
        },
        iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
      });
    } else {
      dispatch(getGuestToken());
    }
  }, [guestToken]);

  return (
    <div id="superset-container"></div>
  );
};

export default CountryAdminDashboard;

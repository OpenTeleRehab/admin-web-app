import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGuestToken } from '../../store/superset/actions';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import PropTypes from 'prop-types';

const Dashboard = ({ dashboardId }) => {
  const dispatch = useDispatch();
  const { guestToken } = useSelector(state => state.superset);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!guestToken) {
      dispatch(getGuestToken());
      return;
    }

    if (containerRef.current) {
      embedDashboard({
        id: dashboardId,
        supersetDomain: process.env.REACT_APP_SUPERSET_API_BASE_URL,
        mountPoint: containerRef.current,
        fetchGuestToken: () => guestToken,
        dashboardUiConfig: {
          hideTitle: true,
          filters: { expanded: true }
        },
        iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
      });
    }
  }, [guestToken]);

  return <div id="superset-container" ref={containerRef}></div>;
};

Dashboard.propTypes = {
  dashboardId: PropTypes.string.isRequired
};

export default Dashboard;

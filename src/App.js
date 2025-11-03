import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { LocalizeProvider } from 'react-localize-redux';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Survey from 'components/Survey';

import RouteSwitch from 'routes';
import store from 'store';
import keycloak from 'utils/keycloak';

import 'scss/app.scss';
import SplashScreen from 'components/SplashScreen';
import ConfigurationProvider from './ConfigurationProvider';
import { DialogProvider } from 'components/V2/Dialog';
import ReactQueryProvider from 'ReactQueryProvider';
import { ToastProvider } from 'components/V2/Toast';

const App = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: process.env.REACT_APP_KEYCLOAK_OPTION_ON_LOAD,
        checkLoginIframe: process.env.REACT_APP_KEYCLOAK_OPTION_CHECK_LOGIN_IFRAME === 'true'
      }}
      LoadingComponent={<SplashScreen />}
    >
      <Provider store={store}>
        <ToastProvider>
          <ReactQueryProvider>
            <ConfigurationProvider>
              <LocalizeProvider store={store}>
                <DialogProvider>
                  <Router history={createBrowserHistory()}>
                    <RouteSwitch />
                    <Survey />
                  </Router>
                </DialogProvider>
              </LocalizeProvider>
            </ConfigurationProvider>
          </ReactQueryProvider>
        </ToastProvider>
      </Provider>
    </ReactKeycloakProvider>
  );
};

export default App;

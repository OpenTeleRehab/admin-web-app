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
        <ConfigurationProvider>
          <LocalizeProvider store={store}>
            <Router history={createBrowserHistory()}>
              <RouteSwitch />
              <Survey />
            </Router>
          </LocalizeProvider>
        </ConfigurationProvider>
      </Provider>
    </ReactKeycloakProvider>
  );
};

export default App;

import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { LocalizeProvider } from 'react-localize-redux';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import RouteSwitch from 'routes';
import store from 'store';
import keycloak from 'utils/keycloak';

import 'scss/app.scss';
import SplashScreen from 'components/SplashScreen';

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
        <LocalizeProvider store={store}>
          <Router history={createBrowserHistory()}>
            <RouteSwitch />
          </Router>
        </LocalizeProvider>
      </Provider>
    </ReactKeycloakProvider>
  );
};

export default App;

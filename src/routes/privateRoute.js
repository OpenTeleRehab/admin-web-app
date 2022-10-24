import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import * as ROUTES from 'variables/routes';
import { USER_GROUPS } from '../variables/user';

const PrivateRoute = ({ children, title, roles, ...rest }) => {
  const { keycloak } = useKeycloak();
  const { profile } = useSelector(state => state.auth);

  return (
    <Route
      {...rest}
      render={() => {
        if (keycloak.authenticated === false) {
          keycloak.login();
          return;
        }

        if (roles) {
          const role = roles.find(role => {
            return keycloak.hasRealmRole(role);
          });

          if (!role) {
            if (rest.path === ROUTES.DASHBOARD) {
              if (profile.type === USER_GROUPS.TRANSLATOR) {
                return <Redirect to={ROUTES.SERVICE_SETUP} />;
              }

              return <Redirect to="not_found" />;
            }

            return <Redirect to={ROUTES.DASHBOARD} />;
          }
        }

        return children;
      }}
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  location: PropTypes.object,
  title: PropTypes.string,
  roles: PropTypes.array
};

export default PrivateRoute;

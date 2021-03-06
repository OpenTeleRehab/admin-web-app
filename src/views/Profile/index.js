import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import Editing from './ProfileInformation/editInformation';
import Password from './ProfileInformation/password';
import * as ROUTES from 'variables/routes';

const VIEW_PROFILE = 'info';
const VIEW_PASSWORD = 'password';

const Profile = ({ translate }) => {
  const { hash } = useLocation();
  const [view, setView] = useState(VIEW_PROFILE);

  useEffect(() => {
    if (hash.includes('#password')) {
      setView(VIEW_PASSWORD);
    } else {
      setView(VIEW_PROFILE);
    }
  }, [hash]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('personal')}</h1>
      </div>

      <Nav variant="tabs" activeKey={view}>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.PROFILE} eventKey={VIEW_PROFILE}>
            {translate('profile.information')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.PROFILE_PASSWORD} eventKey={VIEW_PASSWORD}>
            {translate('profile.password')}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      { view === VIEW_PROFILE && <Editing /> }
      { view === VIEW_PASSWORD && <Password /> }
    </>
  );
};

Profile.propTypes = {
  translate: PropTypes.func
};

export default Profile;

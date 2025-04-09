import React, { useState } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Navbar, Nav, Dropdown, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import * as ROUTES from 'variables/routes';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import { USER_ROLES, SETTING_ROLES } from 'variables/user';
import { Auth } from 'services/auth';
import DownloadTracker from '../components/DownloadTracker';
import { BsCloudDownload } from 'react-icons/bs';

const navItems = [
  {
    label: 'dashboard',
    to: ROUTES.DASHBOARD,
    exact: true,
    roles: [USER_ROLES.VIEW_DASHBOARD]
  },
  {
    label: 'admin',
    to: ROUTES.ADMIN,
    exact: true,
    roles: [
      USER_ROLES.MANAGE_ORGANIZATION_ADMIN,
      USER_ROLES.MANAGE_COUNTRY_ADMIN,
      USER_ROLES.MANAGE_CLINIC_ADMIN
    ]
  },
  {
    label: 'translator',
    to: ROUTES.TRANSLATOR,
    exact: true,
    roles: [USER_ROLES.MANAGE_TRANSLATOR]
  },
  {
    label: 'therapist',
    to: ROUTES.THERAPIST,
    exact: true,
    roles: [USER_ROLES.MANAGE_THERAPIST, USER_ROLES.MANAGE_COUNTRY_ADMIN]
  },
  {
    label: 'patient',
    to: ROUTES.PATIENT,
    exact: true,
    roles: [USER_ROLES.MANAGE_COUNTRY_ADMIN, USER_ROLES.MANAGE_CLINIC_ADMIN, USER_ROLES.MANAGE_THERAPIST]
  },
  {
    label: 'service_setup',
    to: ROUTES.SERVICE_SETUP,
    exact: false,
    roles: [USER_ROLES.MANAGE_ORGANIZATION_ADMIN, USER_ROLES.TRANSLATE_EXERCISE, USER_ROLES.TRANSLATE_EDUCATIONAL_MATERIAL, USER_ROLES.TRANSLATE_QUESTIONNAIRE]
  },
  {
    label: 'category',
    to: ROUTES.CATEGORY,
    exact: true,
    roles: [USER_ROLES.SETUP_CATEGORY, USER_ROLES.TRANSLATE_CATEGORY]
  },
  {
    label: 'setting',
    to: ROUTES.SETTING,
    exact: true,
    roles: SETTING_ROLES
  },
  {
    label: 'audit_logs',
    to: ROUTES.AUDIT_LOGS,
    exact: true,
    roles: [USER_ROLES.ORGANIZATION_ADMIN, USER_ROLES.COUNTRY_ADMIN, USER_ROLES.CLINIC_ADMIN, USER_ROLES.MANAGE_ORGANIZATION_ADMIN]
  }
];

const Navigation = ({ translate }) => {
  const { keycloak } = useKeycloak();
  const [show, setShow] = useState(false);
  const { profile } = useSelector((state) => state.auth);
  const [showDownloadTrackers, setShowDownloadTrackers] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = async () => {
    if (keycloak.authenticated) {
      // Audit log for logout
      await Auth.logUserAuthAction({
        type: 'logout',
        log_name: 'admin_service'
      });
      keycloak.logout();
    }
  };
  const handleShowRole = (role) => {
    return translate(`common.${role}`);
  };

  return (
    <Navbar bg="primary" variant="dark" expand="xl" sticky="top" className="main-nav">
      <Navbar.Brand>
        <Link to={ROUTES.DASHBOARD}>
          <img
            src="/images/logo.png"
            className="d-inline-block align-top"
            alt="OpenTeleRehap logo"
            width="125"
          />
        </Link>
      </Navbar.Brand>
      <span className="portal-name ml-3">
        {translate('portal.name')}
      </span>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>{translate('common.download.history')}</Tooltip>}
      >
        <Button aria-label="Download history" variant="link" className="ml-5 p-0" onClick={() => setShowDownloadTrackers(true)}>
          <BsCloudDownload size={25} />
        </Button>
      </OverlayTrigger>
      <DownloadTracker showDownloadTrackers={showDownloadTrackers} setShowDownloadTrackers={setShowDownloadTrackers} />
      <Navbar.Toggle aria-controls="basic-navbar-nav ml-auto" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto" variant="pills">
          {
            navItems.map(({ label, to, exact, roles }, key) => {
              if (roles) {
                const role = roles.find(role => {
                  return keycloak.hasRealmRole(role);
                });

                if (!role) {
                  return null;
                }
              }

              return (
                <NavLink
                  to={to}
                  exact={exact}
                  key={key}
                  className="d-flex align-items-center nav-link"
                >
                  {translate(label)}
                </NavLink>
              );
            })
          }

          { profile !== undefined && (
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                {translate('common.welcome')} {profile.last_name} {profile.first_name}
                <br/>
                {handleShowRole(profile.type)}
              </Dropdown.Toggle>

              <Dropdown.Menu
                alignRight={true}
              >
                <Dropdown.Item as={Link} to={ROUTES.PROFILE}>
                  {translate('profile.setting')}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={ROUTES.FAQ}>
                  {translate('profile.faq')}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={ROUTES.TC}>
                  {translate('profile.tc')}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={ROUTES.PP}>
                  {translate('profile.pp')}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShow}>{translate('logout')}</Dropdown.Item>
                <Dialog
                  show={show}
                  title={translate('logout.confirmation')}
                  cancelLabel={translate('logout.cancel')}
                  onCancel={handleClose}
                  confirmLabel={translate('logout.confirm')}
                  onConfirm={handleConfirm}
                >
                  <p>{translate('logout.message')}</p>
                </Dialog>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

Navigation.propTypes = {
  translate: PropTypes.func
};

export default withRouter(Navigation);

import React, { useEffect, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';
import { useKeycloak } from '@react-keycloak/web';
import PropTypes from 'prop-types';

import Country from 'views/Setting/Country';
import Translation from 'views/Setting/Translation';
import TermAndCondition from 'views/Setting/TermAndCondition';
import PrivacyPolicy from 'views/Setting/PrivacyPolicy';
import SystemLimit from 'views/Setting/SystemLimit';
import Clinic from 'views/Setting/Clinic';
import Profession from 'views/Setting/Profession';
import Language from 'views/Setting/Language';
import StaticPage from 'views/Setting/StaticPage';

import * as ROUTES from 'variables/routes';
import { USER_ROLES, SETTING_ROLES } from 'variables/user';
import CreateCountry from 'views/Setting/Country/create';
import CreateClinic from 'views/Setting/Clinic/create';
import CreateLanguage from 'views/Setting/Language/create';
import CreateTermAndCondition from 'views/Setting/TermAndCondition/create';
import CreateStaticPage from 'views/Setting/StaticPage/create';
import CreateProfession from 'views/Setting/Profession/create';
import CreatePrivacyPolicy from 'views/Setting/PrivacyPolicy/create';

const VIEW_COUNTRY = 'country';
const VIEW_TRANSLATION = 'translation';
const VIEW_TERM_AND_CONDITION = 'term_and_condition';
const VIEW_PRIVACY_POLICY = 'privacy_policy';
const VIEW_SYSTEM_LIMIT = 'system_limit';
const VIEW_CLINIC = 'clinic';
const VIEW_PROFESSION = 'profession';
const VIEW_LANGUAGE = 'language';
const VIEW_STATIC_PAGE = 'static_page';

const Setting = ({ translate }) => {
  const { keycloak } = useKeycloak();
  const { hash } = useLocation();
  const [view, setView] = useState(undefined);
  const [show, setShow] = useState(false);

  const [editId, setEditId] = useState('');

  useEffect(() => {
    if (hash.includes('#' + VIEW_TRANSLATION)) {
      setView(VIEW_TRANSLATION);
    } else if (hash.includes('#' + VIEW_TERM_AND_CONDITION)) {
      setView(VIEW_TERM_AND_CONDITION);
    } else if (hash.includes('#' + VIEW_PRIVACY_POLICY)) {
      setView(VIEW_PRIVACY_POLICY);
    } else if (hash.includes('#' + VIEW_SYSTEM_LIMIT)) {
      setView(VIEW_SYSTEM_LIMIT);
    } else if (hash.includes('#' + VIEW_CLINIC)) {
      setView(VIEW_CLINIC);
    } else if (hash.includes('#' + VIEW_PROFESSION)) {
      setView(VIEW_PROFESSION);
    } else if (hash.includes('#' + VIEW_LANGUAGE)) {
      setView(VIEW_LANGUAGE);
    } else if (hash.includes('#' + VIEW_STATIC_PAGE)) {
      setView(VIEW_STATIC_PAGE);
    } else {
      for (const role of SETTING_ROLES) {
        if (keycloak.hasRealmRole(role)) {
          setView(role.replace('manage_', ''));
          break;
        }
      }
    }
  }, [hash, keycloak]);

  const handleShow = () => {
    setShow(true);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('setting')}</h1>
        {[VIEW_COUNTRY, VIEW_LANGUAGE, VIEW_TERM_AND_CONDITION, VIEW_PRIVACY_POLICY, VIEW_CLINIC, VIEW_STATIC_PAGE, VIEW_PROFESSION].map(v => {
          if (v === view) {
            return (
              <div className="btn-toolbar mb-2 mb-md-0">
                <Button variant="primary" onClick={handleShow}>
                  <BsPlus size={20} className="mr-1" />
                  { translate(`${view}.new`) }
                </Button>
              </div>
            );
          }
          return null;
        })}
      </div>

      {show && view === VIEW_COUNTRY && <CreateCountry show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_LANGUAGE && <CreateLanguage show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_TERM_AND_CONDITION && <CreateTermAndCondition show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_PRIVACY_POLICY && <CreatePrivacyPolicy show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_CLINIC && <CreateClinic show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_STATIC_PAGE && <CreateStaticPage show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_PROFESSION && <CreateProfession show={show} editId={editId} handleClose={handleClose} />}

      <Nav variant="tabs" activeKey={view} className="mb-3">
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING} eventKey={VIEW_COUNTRY}>
              {translate('setting.countries')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_LANGUAGE) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_LANGUAGE} eventKey={VIEW_LANGUAGE}>
              {translate('setting.languages')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_TRANSLATION) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_TRANSLATIONS} eventKey={VIEW_TRANSLATION}>
              {translate('setting.translations')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_TERM_CONDITION) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_TERM_AND_CONDITION} eventKey={VIEW_TERM_AND_CONDITION}>
              {translate('setting.term_and_conditions')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_PRIVACY_POLICY) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_PRIVACY_POLICY} eventKey={VIEW_PRIVACY_POLICY}>
              {translate('setting.privacy_policy')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_SYSTEM_LIMIT) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_SYSTEM_LIMIT} eventKey={VIEW_SYSTEM_LIMIT}>
              {translate('setting.system_limits')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_CLINIC} eventKey={VIEW_CLINIC}>
              {translate('setting.clinics')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_PROFESSION) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_PROFESSION} eventKey={VIEW_PROFESSION}>
              {translate('setting.professions')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_STATIC_PAGE) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_STATIC_PAGE} eventKey={VIEW_STATIC_PAGE}>
              {translate('setting.static_page')}
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>

      { keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY) && view === VIEW_COUNTRY && <Country handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_LANGUAGE) && view === VIEW_LANGUAGE && <Language handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_TRANSLATION) && view === VIEW_TRANSLATION && <Translation /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_TERM_CONDITION) && view === VIEW_TERM_AND_CONDITION && <TermAndCondition handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_SYSTEM_LIMIT) && view === VIEW_SYSTEM_LIMIT && <SystemLimit /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC) && view === VIEW_CLINIC && <Clinic handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_PROFESSION) && view === VIEW_PROFESSION && <Profession handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_STATIC_PAGE) && view === VIEW_STATIC_PAGE && <StaticPage handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_PRIVACY_POLICY) && view === VIEW_PRIVACY_POLICY && <PrivacyPolicy handleRowEdit={handleEdit} /> }

    </>
  );
};

Setting.propTypes = {
  translate: PropTypes.func
};

export default Setting;

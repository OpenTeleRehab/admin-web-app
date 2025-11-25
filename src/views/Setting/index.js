import React, { useEffect, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { BsPlus, BsUpload } from 'react-icons/bs';
import { useKeycloak } from '@react-keycloak/web';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Country from 'views/Setting/Country';
import Translation from 'views/Setting/Translation';
import TermAndCondition from 'views/Setting/TermAndCondition';
import PrivacyPolicy from 'views/Setting/PrivacyPolicy';
import SystemLimit from 'views/Setting/SystemLimit';
import Clinic from 'views/Setting/Clinic';
import PhcService from 'views/Setting/PhcService';
import Profession from 'views/Setting/Profession';
import Language from 'views/Setting/Language';
import StaticPage from 'views/Setting/StaticPage';
import GuidancePage from 'views/Setting/Guidance';
import Disease from 'views/Setting/Disease';
import ColorScheme from 'views/Setting/ColorScheme';
import Organization from './Organization';
import AssistiveTechnology from './AssistiveTechnology';

import * as ROUTES from 'variables/routes';
import {
  USER_ROLES,
  SETTING_ROLES,
  USER_GROUPS
} from 'variables/user';
import {
  SETTINGS,
  VIEW_COUNTRY,
  VIEW_TRANSLATION,
  VIEW_TERM_AND_CONDITION,
  VIEW_PRIVACY_POLICY,
  VIEW_SYSTEM_LIMIT,
  VIEW_CLINIC,
  VIEW_PROFESSION,
  VIEW_LANGUAGE,
  VIEW_STATIC_PAGE,
  VIEW_GUIDANCE_PAGE,
  VIEW_DISEASE,
  VIEW_ORGANIZATION,
  VIEW_ASSISTIVE_TECHNOLOGY,
  VIEW_COLOR_SCHEME,
  VIEW_SURVEY,
  VIEW_HEALTH_CONDITION,
  VIEW_MFA_POLICY,
  VIEW_REGION,
  VIEW_PROVINCE,
  VIEW_PHC_SERVICE
} from '../../variables/setting';
import CreateCountry from 'views/Setting/Country/create';
import CreateClinic from 'views/Setting/Clinic/create';
import CreateLanguage from 'views/Setting/Language/create';
import CreateTermAndCondition from 'views/Setting/TermAndCondition/create';
import CreateStaticPage from 'views/Setting/StaticPage/create';
import CreateProfession from 'views/Setting/Profession/create';
import CreatePrivacyPolicy from 'views/Setting/PrivacyPolicy/create';
import CreateGuidancePage from 'views/Setting/Guidance/create';
import CreateDisease from 'views/Setting/Disease/create';
import UploadDisease from './Disease/upload';
import CreateOrganization from './Organization/create';
import CreateAssistiveTechnology from './AssistiveTechnology/create';
import CreateSurvey from './Survey/create';
import Survey from './Survey';
import HealthCondition from './HealthCondition';
import MfaPolicy from './MfaPolicy';
import CreateMfaPolicy from './MfaPolicy/create';
import useDialog from 'components/V2/Dialog';
import CreateRegion from './Region/_Partials/createOrEdit';
import CreateProvince from './Province/_Partials/createOrEdit';
import Region from './Region';
import Province from './Province';
import CreateEditPhcService from './PhcService/_Partials/createEdit';
import { END_POINTS } from 'variables/endPoint';
import { useList } from 'hooks/useList';

const Setting = ({ translate }) => {
  const { keycloak } = useKeycloak();
  const { hash } = useLocation();
  const history = useHistory();
  const { profile } = useSelector((state) => state.auth);
  const [view, setView] = useState(undefined);
  const [show, setShow] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editId, setEditId] = useState();
  const { openDialog } = useDialog();
  useList(END_POINTS.PROVINCES_LIMITATION);

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
    } else if (hash.includes('#' + VIEW_PHC_SERVICE)) {
      setView(VIEW_PHC_SERVICE);
    } else if (hash.includes('#' + VIEW_PROFESSION)) {
      setView(VIEW_PROFESSION);
    } else if (hash.includes('#' + VIEW_LANGUAGE)) {
      setView(VIEW_LANGUAGE);
    } else if (hash.includes('#' + VIEW_STATIC_PAGE)) {
      setView(VIEW_STATIC_PAGE);
    } else if (hash.includes('#' + VIEW_GUIDANCE_PAGE)) {
      setView(VIEW_GUIDANCE_PAGE);
    } else if (hash.includes('#' + VIEW_DISEASE)) {
      setView(VIEW_DISEASE);
    } else if (hash.includes('#' + VIEW_ORGANIZATION)) {
      setView(VIEW_ORGANIZATION);
    } else if (hash.includes('#' + VIEW_ASSISTIVE_TECHNOLOGY)) {
      setView(VIEW_ASSISTIVE_TECHNOLOGY);
    } else if (hash.includes('#' + VIEW_COLOR_SCHEME)) {
      setView(VIEW_COLOR_SCHEME);
    } else if (hash.includes('#' + VIEW_SURVEY)) {
      setView(VIEW_SURVEY);
    } else if (hash.includes('#' + VIEW_MFA_POLICY)) {
      setView(VIEW_MFA_POLICY);
    } else if (hash.includes('#' + VIEW_HEALTH_CONDITION)) {
      setView(VIEW_HEALTH_CONDITION);
    } else if (hash.includes('#' + VIEW_REGION)) {
      setView(VIEW_REGION);
    } else if (hash.includes('#' + VIEW_PROVINCE)) {
      setView(VIEW_PROVINCE);
    } else {
      if (keycloak.hasRealmRole(USER_ROLES.TRANSLATE_TRANSLATION)) {
        history.push(ROUTES.SETTING_TRANSLATIONS);
      }
      for (const role of SETTING_ROLES) {
        if (keycloak.hasRealmRole(role)) {
          setView(role.replace('manage_', ''));
          break;
        }
      }
    }
  }, [hash, keycloak, history]);

  const handleShow = () => {
    if (view !== VIEW_REGION && view !== VIEW_PROVINCE && view !== VIEW_PHC_SERVICE) {
      setShow(true);

      return;
    }

    switch (view) {
      case VIEW_REGION:
        openDialog({
          title: translate('region.new.title'),
          content: <CreateRegion />,
          props: { size: 'lg' }
        });
        break;
      case VIEW_PROVINCE:
        openDialog({
          title: translate('province.new'),
          content: <CreateProvince />,
          props: { size: 'lg' }
        });
        break;
      case VIEW_PHC_SERVICE:
        openDialog({
          title: translate('phc_service.new'),
          content: <CreateEditPhcService />
        });
        break;
      default:
        break;
    }
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleShowUploadDialog = () => {
    setShowUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setShowUploadDialog(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('setting')}</h1>

        {SETTINGS.map(v => {
          if (v === view) {
            return (
              <div key={v} className="d-flex">
                {view === VIEW_DISEASE && keycloak.hasRealmRole(USER_ROLES.MANAGE_DISEASE) && (
                  <div className="btn-toolbar mb-2 mb-md-0 mr-2">
                    <Button variant="primary" onClick={handleShowUploadDialog}>
                      <BsUpload size={20} className="mr-1" />
                      { translate('disease.upload') }
                    </Button>
                  </div>
                )}

                <div className="btn-toolbar mb-2 mb-md-0">
                  {((view === VIEW_TERM_AND_CONDITION && keycloak.hasRealmRole(USER_ROLES.MANAGE_TERM_CONDITION)) ||
                    (view === VIEW_PRIVACY_POLICY && keycloak.hasRealmRole(USER_ROLES.MANAGE_PRIVACY_POLICY)) ||
                    (view === VIEW_COUNTRY && keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY)) ||
                    (view === VIEW_CLINIC && keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC)) ||
                    (view === VIEW_PHC_SERVICE && keycloak.hasRealmRole(USER_ROLES.MANAGE_PHC_SERVICE)) ||
                    (view === VIEW_PROFESSION && keycloak.hasRealmRole(USER_ROLES.MANAGE_PROFESSION)) ||
                    (view === VIEW_MFA_POLICY && keycloak.hasRealmRole(USER_ROLES.MANAGE_MFA_POLICY)) ||
                    (keycloak.hasRealmRole(USER_ROLES.MANAGE_SURVEY)) ||
                    (view === VIEW_REGION && keycloak.hasRealmRole(USER_ROLES.MANAGE_REGION)) ||
                    (view === VIEW_PROVINCE && keycloak.hasRealmRole(USER_ROLES.MANAGE_PROVINCE)) ||
                    (profile && profile.type === USER_GROUPS.SUPER_ADMIN)) &&
                    (view !== VIEW_TRANSLATION) && (view !== VIEW_SYSTEM_LIMIT) && (view !== VIEW_HEALTH_CONDITION) && (
                    <Button variant="primary" onClick={handleShow}>
                      <BsPlus size={20} className="mr-1" />
                      { translate(`${view}.new`) }
                    </Button>
                  )}
                </div>
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
      {show && view === VIEW_GUIDANCE_PAGE && <CreateGuidancePage show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_PROFESSION && <CreateProfession show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_DISEASE && <CreateDisease show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_ORGANIZATION && <CreateOrganization show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_ASSISTIVE_TECHNOLOGY && <CreateAssistiveTechnology show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_SURVEY && <CreateSurvey show={show} editId={editId} handleClose={handleClose} />}
      {show && view === VIEW_MFA_POLICY && <CreateMfaPolicy show={show} handleClose={handleClose} />}
      {showUploadDialog && view === VIEW_DISEASE && <UploadDisease showUploadDialog={showUploadDialog} handleCloseUploadDialog={handleCloseUploadDialog} setShowUploadDialog={setShowUploadDialog} />}

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
        { (keycloak.hasRealmRole(USER_ROLES.MANAGE_TRANSLATION) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_TRANSLATION)) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_TRANSLATIONS} eventKey={VIEW_TRANSLATION}>
              {translate('setting.translations')}
            </Nav.Link>
          </Nav.Item>
        )}
        { (keycloak.hasRealmRole(USER_ROLES.MANAGE_TERM_CONDITION) || keycloak.hasRealmRole(USER_ROLES.VIEW_TERM_CONDITION) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_TERM_CONDITION)) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_TERM_AND_CONDITION} eventKey={VIEW_TERM_AND_CONDITION}>
              {translate('setting.term_and_conditions')}
            </Nav.Link>
          </Nav.Item>
        )}
        { (keycloak.hasRealmRole(USER_ROLES.MANAGE_PRIVACY_POLICY) || keycloak.hasRealmRole(USER_ROLES.VIEW_PRIVACY_POLICY) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_PRIVACY_POLICY)) && (
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
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_PROVINCE) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_PROVINCE} eventKey={VIEW_PROVINCE}>
              {translate('setting.province')}
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
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_PHC_SERVICE) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_PHC_SERVICE} eventKey={VIEW_PHC_SERVICE}>
              {translate('setting.phc_service')}
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
        { (keycloak.hasRealmRole(USER_ROLES.MANAGE_STATIC_PAGE) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_STATIC_PAGE)) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_STATIC_PAGE} eventKey={VIEW_STATIC_PAGE}>
              {translate('setting.static_page')}
            </Nav.Link>
          </Nav.Item>
        )}
        { (keycloak.hasRealmRole(USER_ROLES.MANAGE_GUIDANCE_PAGE) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_GUIDANCE_PAGE)) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_GUIDANCE_PAGE} eventKey={VIEW_GUIDANCE_PAGE}>
              {translate('setting.guidance_page')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_DISEASE) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_DISEASE} eventKey={VIEW_DISEASE}>
              {translate('setting.disease')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_ORGANIZATION} eventKey={VIEW_ORGANIZATION}>
              {translate('setting.organization')}
            </Nav.Link>
          </Nav.Item>
        )}
        { (keycloak.hasRealmRole(USER_ROLES.MANAGE_ASSISTIVE_TECHNOLOGY) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_ASSISTIVE_TECHNOLOGY)) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_ASSISTIVE_TECHNOLOGY} eventKey={VIEW_ASSISTIVE_TECHNOLOGY}>
              {translate('setting.assistive_technology')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_COLOR_SCHEME) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_COLOR_SCHEME} eventKey={VIEW_COLOR_SCHEME}>
              {translate('setting.color_scheme')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_SURVEY) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_SURVEY} eventKey={VIEW_SURVEY}>
              {translate('setting.survey')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_HEALTH_CONDITION) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_HEALTH_CONDITION} eventKey={VIEW_HEALTH_CONDITION}>
              {translate('setting.health_conditions')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_MFA_POLICY) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_MFA_POLICY} eventKey={VIEW_MFA_POLICY}>
              {translate('setting.mfa.policy')}
            </Nav.Link>
          </Nav.Item>
        )}
        { keycloak.hasRealmRole(USER_ROLES.MANAGE_REGION) && (
          <Nav.Item>
            <Nav.Link as={Link} to={ROUTES.SETTING_REGION} eventKey={VIEW_REGION}>
              {translate('setting.region')}
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>

      { keycloak.hasRealmRole(USER_ROLES.MANAGE_COUNTRY) && view === VIEW_COUNTRY && <Country handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_LANGUAGE) && view === VIEW_LANGUAGE && <Language handleRowEdit={handleEdit} /> }
      { (keycloak.hasRealmRole(USER_ROLES.MANAGE_TRANSLATION) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_TRANSLATION)) && view === VIEW_TRANSLATION && <Translation /> }
      { (keycloak.hasRealmRole(USER_ROLES.MANAGE_TERM_CONDITION) || keycloak.hasRealmRole(USER_ROLES.VIEW_TERM_CONDITION) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_TERM_CONDITION)) && view === VIEW_TERM_AND_CONDITION && <TermAndCondition handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_SYSTEM_LIMIT) && view === VIEW_SYSTEM_LIMIT && <SystemLimit /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_CLINIC) && view === VIEW_CLINIC && <Clinic handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_PHC_SERVICE) && view === VIEW_PHC_SERVICE && <PhcService /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_PROFESSION) && view === VIEW_PROFESSION && <Profession handleRowEdit={handleEdit} /> }
      { (keycloak.hasRealmRole(USER_ROLES.MANAGE_STATIC_PAGE) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_STATIC_PAGE)) && view === VIEW_STATIC_PAGE && <StaticPage handleRowEdit={handleEdit} /> }
      { (keycloak.hasRealmRole(USER_ROLES.MANAGE_PRIVACY_POLICY) || keycloak.hasRealmRole(USER_ROLES.VIEW_PRIVACY_POLICY) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_PRIVACY_POLICY)) && view === VIEW_PRIVACY_POLICY && <PrivacyPolicy handleRowEdit={handleEdit} /> }
      { (keycloak.hasRealmRole(USER_ROLES.MANAGE_GUIDANCE_PAGE) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_GUIDANCE_PAGE)) && view === VIEW_GUIDANCE_PAGE && <GuidancePage handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_DISEASE) && view === VIEW_DISEASE && <Disease handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_ORGANIZATION) && view === VIEW_ORGANIZATION && <Organization handleRowEdit={handleEdit} /> }
      { (keycloak.hasRealmRole(USER_ROLES.MANAGE_ASSISTIVE_TECHNOLOGY) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_ASSISTIVE_TECHNOLOGY)) && view === VIEW_ASSISTIVE_TECHNOLOGY && <AssistiveTechnology handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_COLOR_SCHEME) && view === VIEW_COLOR_SCHEME && <ColorScheme /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_SURVEY) && view === VIEW_SURVEY && <Survey handleRowEdit={handleEdit} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_HEALTH_CONDITION) && view === VIEW_HEALTH_CONDITION && <HealthCondition translate={translate} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_MFA_POLICY) && view === VIEW_MFA_POLICY && <MfaPolicy translate={translate} /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_REGION) && view === VIEW_REGION && <Region /> }
      { keycloak.hasRealmRole(USER_ROLES.MANAGE_PROVINCE) && view === VIEW_PROVINCE && <Province /> }
    </>
  );
};

Setting.propTypes = {
  translate: PropTypes.func
};

export default Setting;

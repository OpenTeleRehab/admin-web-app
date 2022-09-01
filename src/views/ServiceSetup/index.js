import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as ROUTES from 'variables/routes';
import Exercise from './Exercise';
import EducationMaterial from './EducationMaterial';
import Questionnaire from './Questionnaire';
import { BsPlus } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { USER_GROUPS, USER_ROLES } from '../../variables/user';
import keycloak from '../../utils/keycloak';

const VIEW_EXERCISE = 'exercise';
const VIEW_EDUCATION = 'education';
const VIEW_QUESTIONNAIRE = 'questionnaire';

const ServiceSetup = ({ translate }) => {
  const { hash } = useLocation();
  const { profile } = useSelector((state) => state.auth);
  const [view, setView] = useState(undefined);

  useEffect(() => {
    if (hash.includes('#' + VIEW_EDUCATION)) {
      setView(VIEW_EDUCATION);
    } else if (hash.includes('#' + VIEW_QUESTIONNAIRE)) {
      setView(VIEW_QUESTIONNAIRE);
    } else {
      setView(VIEW_EXERCISE);
    }
  }, [hash]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{translate('service_setup')}</h1>
        { profile.type !== USER_GROUPS.ORGANIZATION_ADMIN && !keycloak.hasRealmRole(USER_ROLES.TRANSLATE_QUESTIONNAIRE) &&
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-toolbar mb-2 mb-md-0">
              {view === VIEW_EXERCISE
                ? <Button
                  as={Link} to={ROUTES.EXERCISE_CREATE}>
                  <BsPlus size={20} className="mr-1" />
                  {translate('common.new_content')}
                </Button>
                : view === VIEW_EDUCATION
                  ? <Button
                    as={Link} to={ROUTES.EDUCATION_MATERIAL_CREATE}>
                    <BsPlus size={20} className="mr-1" />
                    {translate('common.new_content')}
                  </Button>
                  : <Button
                    as={Link} to={ROUTES.QUESTIONNAIRE_CREATE}>
                    <BsPlus size={20} className="mr-1" />
                    {translate('common.new_content')}
                  </Button>
              }
            </div>
          </div>
        }
      </div>

      <Nav variant="tabs" activeKey={view} className="mb-3">
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.SERVICE_SETUP} eventKey={VIEW_EXERCISE}>
            {translate('service_setup.exercises')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.SERVICE_SETUP_EDUCATION} eventKey={VIEW_EDUCATION}>
            {translate('service_setup.education_materials')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to={ROUTES.SERVICE_SETUP_QUESTIONNAIRE} eventKey={VIEW_QUESTIONNAIRE}>
            {translate('service_setup.questionnaires')}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      { view === VIEW_EXERCISE && <Exercise /> }
      { view === VIEW_EDUCATION && <EducationMaterial /> }
      { view === VIEW_QUESTIONNAIRE && <Questionnaire /> }
    </>
  );
};

ServiceSetup.propTypes = {
  translate: PropTypes.func
};

export default ServiceSetup;

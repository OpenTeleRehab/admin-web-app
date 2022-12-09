import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import PageLayout from 'layout/layout';
import PrivateRoute from 'routes/privateRoute';
import DashboardPage from 'views/Dashboard';
import NotFoundPage from 'views/NotFound';
import AdminPage from 'views/Admin';
import TranslatorPage from 'views/Translator';
import CategoryPage from 'views/Category';
import Setting from 'views/Setting';
import ServiceSetupPage from 'views/ServiceSetup';
import CreateExercise from 'views/ServiceSetup/Exercise/create';
import CreateEducationMaterial from 'views/ServiceSetup/EducationMaterial/create';
import CreateQuestionnaire from 'views/ServiceSetup/Questionnaire/create';
import Therapist from 'views/Therapist';
import Patient from 'views/Patient';
import ProfilePage from 'views/Profile';
import FaqPage from 'views/Faq';
import TermConditionPage from 'views/TermCondition';
import PrivacyPolicyPage from 'views/PrivacyPolicy';
import AssistiveTechnologyPatientPage from 'views/AssistiveTechnologyPatient';

import * as ROUTES from 'variables/routes';
import { USER_ROLES, SETTING_ROLES } from 'variables/user';
import ViewPatient from 'views/Patient/viewPatient';
import ViewTreatmentPlan from 'views/TreatmentPlan/detail';
const PRIVATE = 'private';
const PUBLIC = 'public';

const routes = [
  {
    title: 'dashboard',
    path: ROUTES.DASHBOARD,
    component: DashboardPage,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.VIEW_DASHBOARD]
  },
  {
    title: 'admin',
    path: ROUTES.ADMIN,
    component: AdminPage,
    exact: true,
    type: PRIVATE,
    roles: [
      USER_ROLES.MANAGE_ORGANIZATION_ADMIN,
      USER_ROLES.MANAGE_COUNTRY_ADMIN,
      USER_ROLES.MANAGE_CLINIC_ADMIN
    ]
  },
  {
    title: 'translator',
    path: ROUTES.TRANSLATOR,
    component: TranslatorPage,
    exact: true,
    type: PRIVATE,
    roles: [
      USER_ROLES.MANAGE_TRANSLATOR
    ]
  },
  {
    title: 'therapist',
    path: ROUTES.THERAPIST,
    component: Therapist,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.MANAGE_THERAPIST, USER_ROLES.MANAGE_ORGANIZATION_ADMIN]
  },
  {
    title: 'patient',
    path: ROUTES.PATIENT,
    component: Patient,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.MANAGE_ORGANIZATION_ADMIN]
  },
  {
    title: 'patient.detail',
    path: ROUTES.VIEW_PATIENT_DETAIL,
    component: ViewPatient,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.detail',
    path: ROUTES.VIEW_TREATMENT_PLAN_DETAIL,
    component: ViewTreatmentPlan,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'service_setup',
    path: ROUTES.SERVICE_SETUP,
    component: ServiceSetupPage,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_EXERCISE, USER_ROLES.TRANSLATE_EXERCISE, USER_ROLES.TRANSLATE_QUESTIONNAIRE, USER_ROLES.TRANSLATE_EDUCATIONAL_MATERIAL]
  },
  {
    title: 'exercise.create',
    path: ROUTES.EXERCISE_CREATE,
    component: CreateExercise,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_EXERCISE]
  },
  {
    title: 'exercise.edit',
    path: ROUTES.EXERCISE_EDIT,
    component: CreateExercise,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_EXERCISE, USER_ROLES.TRANSLATE_EXERCISE]
  },
  {
    title: 'education_material.create',
    path: ROUTES.EDUCATION_MATERIAL_CREATE,
    component: CreateEducationMaterial,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_EDUCATIONAL_MATERIAL]
  },
  {
    title: 'education_material.edit',
    path: ROUTES.EDUCATION_MATERIAL_EDIT,
    component: CreateEducationMaterial,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_EDUCATIONAL_MATERIAL, USER_ROLES.TRANSLATE_EDUCATIONAL_MATERIAL]
  },
  {
    title: 'questionnaire.create',
    path: ROUTES.QUESTIONNAIRE_CREATE,
    component: CreateQuestionnaire,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_QUESTIONNAIRE]
  },
  {
    title: 'questionnaire.edit',
    path: ROUTES.QUESTIONNAIRE_EDIT,
    component: CreateQuestionnaire,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_QUESTIONNAIRE, USER_ROLES.TRANSLATE_QUESTIONNAIRE]
  },
  {
    title: 'category',
    path: ROUTES.CATEGORY,
    component: CategoryPage,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.SETUP_CATEGORY, USER_ROLES.TRANSLATE_CATEGORY]
  },
  {
    title: 'setting',
    path: ROUTES.SETTING,
    component: Setting,
    exact: true,
    type: PRIVATE,
    roles: SETTING_ROLES
  },
  {
    title: 'profile',
    path: ROUTES.PROFILE,
    component: ProfilePage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'faq',
    path: ROUTES.FAQ,
    component: FaqPage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'term-condition',
    path: ROUTES.TC,
    component: TermConditionPage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'privacy-policy',
    path: ROUTES.PP,
    component: PrivacyPolicyPage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'assistive_technology',
    path: ROUTES.ASSISTIVE_TECHNOLOGY,
    component: AssistiveTechnologyPatientPage,
    exact: true,
    type: PRIVATE,
    roles: [USER_ROLES.MANAGE_CLINIC_ADMIN, USER_ROLES.MANAGE_THERAPIST]
  },
  {
    title: 'not_found_page',
    path: '*',
    component: NotFoundPage,
    type: PUBLIC
  }
];

const RouteSwitch = () => {
  const routeComponents = routes.map(({ path, component, exact, type, title, roles }, key) => {
    return type === PUBLIC ? (
      <Route exact={!!exact} path={path} key={key}>
        <PageLayout component={component} title={title} />
      </Route>
    ) : (
      <PrivateRoute exact={!!exact} path={path} key={key} roles={roles}>
        <PageLayout component={component} title={title} />
      </PrivateRoute>
    );
  });

  return (
    <Suspense fallback={<Spinner animation="border" />}>
      <Switch>
        {routeComponents}
      </Switch>
    </Suspense>
  );
};

export default RouteSwitch;

import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  initialize,
  localizeReducer
} from 'react-localize-redux';

import { user } from 'store/user/reducers';
import { therapist, patient } from 'store/therapist/reducers';
import { notification } from 'store/notification/reducers';
import { spinnerOverlay } from 'store/spinnerOverlay/reducers';
import { country } from 'store/country/reducers';
import { clinic } from 'store/clinic/reducers';
import { profession } from 'store/profession/reducers';
import { defaultLimitedPatient } from 'store/setting/reducers';
import { language } from 'store/language/reducers';
import { auth } from 'store/auth/reducers';
import { exercise } from 'store/exercise/reducers';
import { localization } from 'store/localization/reducers';
import { termAndCondition } from 'store/termAndCondition/reducers';
import { educationMaterial } from 'store/educationMaterial/reducers';
import { questionnaire } from 'store/questionnaire/reducers';
import { category } from 'store/category/reducers';
import { staticPage } from 'store/staticPage/reducers';
import { dashboard } from 'store/dashboard/reducers';
import { systemLimit } from 'store/systemLimit/reducers';
import { guidancePage } from 'store/guidancePage/reducers';
import { privacyPolicy } from 'store/privacyPolicy/reducers';
import { treatmentPlan } from 'store/treatmentPlan/reducers';
import { disease } from 'store/disease/reducers';
import { organization } from 'store/organization/reducers';
import { colorScheme } from 'store/colorScheme/reducers';

export const rootReducer = {
  localize: localizeReducer,
  user,
  therapist,
  notification,
  spinnerOverlay,
  country,
  clinic,
  profession,
  language,
  defaultLimitedPatient,
  auth,
  exercise,
  localization,
  termAndCondition,
  patient,
  educationMaterial,
  questionnaire,
  category,
  staticPage,
  dashboard,
  systemLimit,
  privacyPolicy,
  treatmentPlan,
  guidancePage,
  disease,
  organization,
  colorScheme
};

const devTool =
  process.env.NODE_ENV === 'development'
    ? (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()) || compose
    : compose;

const store = createStore(
  combineReducers(rootReducer),
  compose(
    applyMiddleware(thunkMiddleware),
    devTool
  )
);

const languages = [{ name: 'English', code: 'en' }];
const defaultLanguage = 'en';
const onMissingTranslation = ({ translationId }) => translationId;
store.dispatch(initialize({
  languages,
  options: {
    defaultLanguage,
    renderToStaticMarkup,
    onMissingTranslation
  }
}));

export default store;

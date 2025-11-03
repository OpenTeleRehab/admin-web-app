export const DASHBOARD = '/';
export const ADMIN = '/admin';
export const TRANSLATOR = '/translator';

export const SERVICE_SETUP = '/service-setup';
export const ASSISTIVE_TECHNOLOGY = '/assistive-technology';
export const SERVICE_SETUP_EDUCATION = SERVICE_SETUP + '#education';
export const SERVICE_SETUP_QUESTIONNAIRE = SERVICE_SETUP + '#questionnaire';

export const EXERCISE_CREATE = SERVICE_SETUP + '/exercise/create';
export const EXERCISE_EDIT = SERVICE_SETUP + '/exercise/edit/:id';
export const EDUCATION_MATERIAL_CREATE = SERVICE_SETUP + '/education_material/create';
export const EDUCATION_MATERIAL_EDIT = SERVICE_SETUP + '/education_material/edit/:id';
export const QUESTIONNAIRE_CREATE = SERVICE_SETUP + '/questionnaire/create';
export const QUESTIONNAIRE_EDIT = SERVICE_SETUP + '/questionnaire/edit/:id';

export const THERAPIST = '/therapist';
export const PATIENT = '/patient';
export const VIEW_PATIENT_DETAIL = `${PATIENT}/:patientId/country/:countryId`;
export const CATEGORY = '/category';
export const CATEGORY_EDUCATION = CATEGORY + '#education';
export const CATEGORY_QUESTIONNAIRE = CATEGORY + '#questionnaire';

export const SETTING = '/setting';
export const SETTING_TRANSLATIONS = SETTING + '#translation';
export const SETTING_TERM_AND_CONDITION = SETTING + '#term_and_condition';
export const SETTING_PRIVACY_POLICY = SETTING + '#privacy_policy';
export const SETTING_SYSTEM_LIMIT = SETTING + '#system_limit';
export const SETTING_CLINIC = SETTING + '#clinic';
export const SETTING_PROFESSION = SETTING + '#profession';
export const SETTING_STATIC_PAGE = SETTING + '#static_page';
export const SETTING_GUIDANCE_PAGE = SETTING + '#guidance_page';
export const SETTING_LANGUAGE = SETTING + '#language';
export const SETTING_DISEASE = SETTING + '#disease';
export const SETTING_ORGANIZATION = SETTING + '#organization';
export const SETTING_ASSISTIVE_TECHNOLOGY = SETTING + '#assistive_technology';
export const SETTING_COLOR_SCHEME = SETTING + '#color_scheme';
export const SETTING_SURVEY = SETTING + '#survey';
export const SETTING_MFA_POLICY = SETTING + '#mfa_policy';
export const SETTING_HEALTH_CONDITION = SETTING + '#health_condition';

export const PROFILE = '/profile';
export const FAQ = '/faq';
export const TC = '/term-condition';
export const PP = '/privacy-policy';
export const PROFILE_PASSWORD = PROFILE + '#password';

export const VIEW_TREATMENT_PLAN_DETAIL = VIEW_PATIENT_DETAIL + '/treatment-plan/:id';

export const AUDIT_LOGS = '/audit-logs';

export const USER_GROUPS = {
  GLOBAL_ADMIN: 'global_admin',
  COUNTRY_ADMIN: 'country_admin',
  CLINIC_ADMIN: 'clinic_admin'
};

export const USER_ROLES = {
  MANAGE_GLOBAL_ADMIN: 'manage_global_admin',
  MANAGE_COUNTRY_ADMIN: 'manage_country_admin',
  MANAGE_CLINIC_ADMIN: 'manage_clinic_admin',
  MANAGE_THERAPIST: 'manage_therapist',
  MANAGE_PATIENT: 'manage_patient',
  SETUP_CATEGORY: 'setup_category',
  SETUP_EXERCISE: 'setup_exercise',
  SETUP_EDUCATIONAL_MATERIAL: 'setup_educational_material',
  SETUP_QUESTIONNAIRE: 'setup_questionnaire',
  VIEW_REPORT: 'view_report',
  VIEW_TREATMENT_DETAIL: 'view_treatment_detail',
  VIEW_APPOINTMENT: 'view_appointment',
  ARRANGE_APPOINTMENT: 'arrange_appointment',
  CREATE_TREATMENT_PLAN_FOR_PATIENT: 'create_treatment_plan_for_patient',
  VIEW_EXERCISE: 'view_exercise',
  VIEW_EDUCATIONAL_MATERIAL: 'view_educational_material',
  VIEW_QUESTIONNAIRE: 'view_questionnaire',
  SUBMIT_EXERCISE_RESULT: 'submit_exercise_result',
  SUBMIT_QUESTIONNAIRE_ANSWER: 'submit_questionnaire_answer',
  VIEW_GOAL_PROGRESS: 'view_goal_progress',
  INPUT_GOAL_PROGRESS: 'input_goal_progress',
  MESSAGE_CALL_BETWEEN_THERAPIST_PATIENT: 'message_call_between_therapist_patient',
  VIEW_EDIT_OWN_PROFILE: 'view_edit_own_profile',
  MANAGE_COUNTRY: 'manage_country',
  MANAGE_TRANSLATION: 'manage_translation',
  MANAGE_SYSTEM_LIMIT: 'manage_system_limit',
  MANAGE_CLINIC: 'manage_clinic',
  MANAGE_PROFESSION: 'manage_profession',
  MANAGE_LANGUAGE: 'manage_language'
};

export const SETTING_ROLES = [
  USER_ROLES.MANAGE_COUNTRY,
  USER_ROLES.MANAGE_TRANSLATION,
  USER_ROLES.MANAGE_SYSTEM_LIMIT,
  USER_ROLES.MANAGE_CLINIC,
  USER_ROLES.MANAGE_PROFESSION
];

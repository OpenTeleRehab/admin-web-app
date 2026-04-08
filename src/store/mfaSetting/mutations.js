const getMfaSettingsSuccess = (data) => ({
  type: 'GET_MFA_SETTINGS_SUCCESS',
  data
});

const setMfaSettings = (data) => ({
  type: 'SET_MFA_SETTINGS',
  data
});

const getMfaEnforcementValidationSuccess = (data) => ({
  type: 'GET_MFA_ENFORCEMENT_VALIDATION_SUCCESS',
  data
});

const getRegionalAdminMfaValidationSuccess = (data) => ({
  type: 'GET_REGIONAL_ADMIN_MFA_VALIDATION_SUCCESS',
  data
});

const clearMfaEnforcementValidation = () => ({
  type: 'CLEAR_MFA_ENFORCEMENT_VALIDATION'
});

export const mutation = {
  getMfaSettingsSuccess,
  getMfaEnforcementValidationSuccess,
  clearMfaEnforcementValidation,
  setMfaSettings,
  getRegionalAdminMfaValidationSuccess,
};

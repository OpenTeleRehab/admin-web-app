const getMfaSettingsSuccess = (data) => ({
  type: 'GET_MFA_SETTINGS_SUCCESS',
  data
});

const getMfaEnforcementValidationSuccess = (data) => ({
  type: 'GET_MFA_ENFORCEMENT_VALIDATION_SUCCESS',
  data
});

const clearMfaEnforcementValidation = () => ({
  type: 'CLEAR_MFA_ENFORCEMENT_VALIDATION'
});

export const mutation = {
  getMfaSettingsSuccess,
  getMfaEnforcementValidationSuccess,
  clearMfaEnforcementValidation
};

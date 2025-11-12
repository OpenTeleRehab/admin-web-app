const getMfaSettingsSuccess = (data) => ({
  type: 'GET_MFA_SETTINGS_SUCCESS',
  data
});

const getMfaSettingsUserResourcesSuccess = (data) => ({
  type: 'GET_USER_MFA_ATTRIBUTES_SUCCESS',
  data
});

export const mutation = {
  getMfaSettingsSuccess,
  getMfaSettingsUserResourcesSuccess
};

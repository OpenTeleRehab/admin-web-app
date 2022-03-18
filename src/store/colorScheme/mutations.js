const createColorSchemeRequest = () => ({
  type: 'CREATE_COLOR_SCHEME_REQUEST'
});

const createColorSchemeSuccess = () => ({
  type: 'CREATE_COLOR_SCHEME_SUCCESS'
});

const createColorSchemeFail = () => ({
  type: 'CREATE_COLOR_SCHEME_FAIL'
});

const getColorSchemeRequest = () => ({
  type: 'GET_COLOR_SCHEME_REQUEST'
});

const getColorSchemeSuccess = (data) => ({
  type: 'GET_COLOR_SCHEME_SUCCESS',
  data
});

const getColorSchemeFail = () => ({
  type: 'GET_COLOR_SCHEME_FAIL'
});

export const mutation = {
  getColorSchemeRequest,
  getColorSchemeSuccess,
  getColorSchemeFail,
  createColorSchemeRequest,
  createColorSchemeSuccess,
  createColorSchemeFail
};

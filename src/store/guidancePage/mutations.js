const getGuidancePagesRequest = () => ({
  type: 'GET_GUIDANCE_PAGES_REQUEST'
});

const getGuidancePagesSuccess = (data, filters) => ({
  type: 'GET_GUIDANCE_PAGES_SUCCESS',
  data,
  filters
});

const getGuidancePagesFail = () => ({
  type: 'GET_GUIDANCE_PAGES_FAIL'
});

const getGuidancePageRequest = () => ({
  type: 'GET_GUIDANCE_PAGE_REQUEST'
});

const getGuidancePageSuccess = (data) => ({
  type: 'GET_GUIDANCE_PAGE_SUCCESS',
  data
});

const getGuidancePageFail = () => ({
  type: 'GET_GUIDANCE_PAGE_FAIL'
});

const createGuidancePageRequest = () => ({
  type: 'CREATE_GUIDANCE_PAGE_REQUEST'
});

const createGuidancePageSuccess = () => ({
  type: 'CREATE_GUIDANCE_PAGE_SUCCESS'
});

const createGuidancePagesFail = () => ({
  type: 'CREATE_GUIDANCE_PAGE_FAIL'
});

const updateGuidancePageRequest = () => ({
  type: 'UPDATE_GUIDANCE_PAGE_REQUEST'
});

const updateGuidancePageSuccess = () => ({
  type: 'UPDATE_GUIDANCE_PAGE_SUCCESS'
});

const updateGuidancePageFail = () => ({
  type: 'UPDATE_GUIDANCE_PAGE_FAIL'
});

const updateGuidancePagesRequest = () => ({
  type: 'UPDATE_GUIDANCE_PAGES_REQUEST'
});

const updateGuidancePagesSuccess = () => ({
  type: 'UPDATE_GUIDANCE_PAGES_SUCCESS'
});

const updateGuidancePagesFail = () => ({
  type: 'UPDATE_GUIDANCE_PAGES_FAIL'
});

const deleteGuidanceRequest = () => ({
  type: 'DELETE_GUIDANCE_REQUEST'
});

const deleteGuidanceSuccess = () => ({
  type: 'DELETE_GUIDANCE_SUCCESS'
});

const deleteGuidanceFail = () => ({
  type: 'DELETE_GUIDANCE_FAIL'
});

export const mutation = {
  getGuidancePagesRequest,
  getGuidancePagesSuccess,
  getGuidancePagesFail,
  getGuidancePageRequest,
  getGuidancePageSuccess,
  getGuidancePageFail,
  createGuidancePageRequest,
  createGuidancePageSuccess,
  createGuidancePagesFail,
  updateGuidancePageRequest,
  updateGuidancePageSuccess,
  updateGuidancePageFail,
  updateGuidancePagesRequest,
  updateGuidancePagesSuccess,
  updateGuidancePagesFail,
  deleteGuidanceRequest,
  deleteGuidanceSuccess,
  deleteGuidanceFail
};

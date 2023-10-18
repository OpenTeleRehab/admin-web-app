const getStaticPagesRequest = () => ({
  type: 'GET_STATIC_PAGES_REQUEST'
});

const getStaticPagesSuccess = (data, filters) => ({
  type: 'GET_STATIC_PAGES_SUCCESS',
  data,
  filters
});

const getStaticPagesFail = () => ({
  type: 'GET_STATIC_PAGES_FAIL'
});

const getStaticPageRequest = () => ({
  type: 'GET_STATIC_PAGE_REQUEST'
});

const getStaticPageSuccess = (data) => ({
  type: 'GET_STATIC_PAGE_SUCCESS',
  data
});

const getStaticPageFail = () => ({
  type: 'GET_STATIC_PAGE_FAIL'
});

const createStaticPageRequest = () => ({
  type: 'CREATE_STATIC_PAGE_REQUEST'
});

const createStaticPageSuccess = () => ({
  type: 'CREATE_STATIC_PAGE_SUCCESS'
});

const createStaticPagesFail = () => ({
  type: 'CREATE_STATIC_PAGE_FAIL'
});

const updateStaticPageRequest = () => ({
  type: 'UPDATE_STATIC_PAGE_REQUEST'
});

const updateStaticPageSuccess = () => ({
  type: 'UPDATE_STATIC_PAGE_SUCCESS'
});

const updateStaticPagesFail = () => ({
  type: 'UPDATE_STATIC_PAGE_FAIL'
});

const getFaqPageRequest = () => ({
  type: 'GET_FAQ_PAGE_REQUEST'
});

const getFaqPageSuccess = (data) => ({
  type: 'GET_FAQ_PAGE_SUCCESS',
  data
});

const getFaqPageFail = () => ({
  type: 'GET_FAQ_PAGE_FAIL'
});

export const mutation = {
  getStaticPagesRequest,
  getStaticPagesSuccess,
  getStaticPagesFail,
  createStaticPageRequest,
  createStaticPageSuccess,
  createStaticPagesFail,
  getStaticPageRequest,
  getStaticPageSuccess,
  getStaticPageFail,
  updateStaticPageRequest,
  updateStaticPageSuccess,
  updateStaticPagesFail,
  getFaqPageFail,
  getFaqPageSuccess,
  getFaqPageRequest
};

import { initialState } from './states';

export const staticPage = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STATIC_PAGE_SUCCESS': {
      return Object.assign({}, state, {
        staticPage: action.data
      });
    }
    case 'GET_STATIC_PAGES_SUCCESS': {
      return Object.assign({}, state, {
        staticPages: action.data,
        filters: action.filters,
        loading: false
      });
    }
    case 'GET_FAQ_PAGE_SUCCESS': {
      return Object.assign({}, state, {
        faqPage: action.data,
        loading: false
      });
    }
    default:
      return state;
  }
};

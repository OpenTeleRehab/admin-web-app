import { initialState } from './states';

export const survey = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SURVEYS_SUCCESS': {
      return Object.assign({}, state, {
        surveys: action.data
      });
    }
    case 'GET_SURVEY_SUCCESS': {
      return Object.assign({}, state, {
        survey: action.data
      });
    }
    case 'GET_PUBLISH_SURVEY_SUCCESS': {
      return Object.assign({}, state, {
        publishSurveys: action.data
      });
    }
    default:
      return state;
  }
};

import { initialState } from './states';

export const screeningQuestionnaire = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SCREENING_QUESTIONNAIRES_SUCCESS': {
      return Object.assign({}, state, {
        screeningQuestionnaires: action.data
      });
    }
    case 'GET_SCREENING_QUESTIONNAIRE_SUCCESS': {
      return Object.assign({}, state, {
        screeningQuestionnaire: action.data
      });
    }
    case 'GET_PUBLISH_SCREENING_QUESTIONNAIRE_SUCCESS': {
      return Object.assign({}, state, {
        publishQuestionnaires: action.data
      });
    }
    default:
      return state;
  }
};

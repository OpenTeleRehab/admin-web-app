export const SCREENING_QUESTION_TYPE = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  OPEN_TEXT: 'open-text',
  OPEN_NUMBER: 'open-number',
  RATING: 'rating',
  NOTE: 'note',
};

export const DEFAULT_SCREENING_QUESTIONNAIRE_VALUES = {
  id: null,
  title: '',
  description: '',
  sections: [
    {
      id: null,
      title: '',
      description: '',
      questions: [
        {
          id: crypto.randomUUID(),
          question_text: '',
          question_type: SCREENING_QUESTION_TYPE.CHECKBOX,
          mandatory: false,
          file: null,
          options: [
            {
              id: null,
              option_text: '',
              option_point: null,
              threshold: null,
              min: null,
              max: null,
              file: null,
            }
          ],
          logics: [
            {
              id: null,
              question_id: null,
              target_question_id: null,
              target_option_id: null,
              condition_type: 'skip',
              condition_rule: null,
            }
          ]
        }
      ]
    }
  ]
};

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
              id: crypto.randomUUID(),
              option_text: '',
              option_point: null,
              threshold: null,
              min: null,
              max: null,
              min_note: null,
              max_note: null,
              file: null,
            },
            {
              id: crypto.randomUUID(),
              option_text: '',
              option_point: null,
              threshold: null,
              min: null,
              max: null,
              min_note: null,
              max_note: null,
              file: null,
            }
          ],
          logics: [],
        }
      ],
      actions: [
        {
          id: null,
          from: null,
          to: null,
          action_text: null,
        }
      ]
    }
  ]
};

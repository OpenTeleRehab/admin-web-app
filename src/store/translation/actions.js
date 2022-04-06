import { Translation } from 'services/translation';
import { mutation } from './mutations';
import { addTranslationForLanguage } from 'react-localize-redux';

export const getTranslations = (lang) => async dispatch => {
  dispatch(mutation.getTranslationsRequest());
  const data = await Translation.getTranslations(lang);
  if (data && data.data) {
    const messages = {};
    data.data.map(m => {
      messages[m.key] = m.value;
      return true;
    });
    dispatch(addTranslationForLanguage(messages, 'en'));
    dispatch(mutation.getTranslationsSuccess());
    return true;
  } else {
    dispatch(mutation.getTranslationsFail());
  }
};

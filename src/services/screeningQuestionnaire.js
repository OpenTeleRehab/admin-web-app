import axios from 'utils/axios';
import _ from 'lodash';

const getScreeningQuestionnaires = payload => {
  return axios.get('/screening-questionnaires', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getScreeningQuestionnaire = (id) => {
  return axios.get(`/screening-questionnaires/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createScreeningQuestionnaire = (payload) => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    if (value) {
      if (Array.isArray(value) && key === 'sections') {
        formData.append(key, JSON.stringify(value));

        value.forEach((section, sectionIndex) => {
          section.questions?.forEach((question, questionIndex) => {
            if (question.file instanceof File) {
              formData.append(`sections[${sectionIndex}][questions][${questionIndex}][file]`, question.file);
            }
            question.options?.forEach((option, optionIndex) => {
              if (option.file instanceof File) {
                formData.append(`sections[${sectionIndex}][questions][${questionIndex}][options][${optionIndex}][file]`, option.file);
              }
            });
          });
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  return axios.post('/screening-questionnaires', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const updateScreeningQuestionnaire = (id, payload) => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    if (value) {
      if (Array.isArray(value) && key === 'sections') {
        formData.append(key, JSON.stringify(value));

        value.forEach((section, sectionIndex) => {
          section.questions?.forEach((question, questionIndex) => {
            if (question.file instanceof File) {
              formData.append(`sections[${sectionIndex}][questions][${questionIndex}][file]`, question.file);
            }
            question.options?.forEach((option, optionIndex) => {
              if (option.file instanceof File) {
                formData.append(`sections[${sectionIndex}][questions][${questionIndex}][options][${optionIndex}][file]`, option.file);
              }
            });
          });
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  return axios.post(`/screening-questionnaires/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const publishScreeningQuestionnaire = (id) => {
  return axios.post(`/screening-questionnaires/${id}/publish`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteScreeningQuestionnaire = (id) => {
  return axios.delete(`/screening-questionnaires/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const ScreeningQuestionnaire = {
  getScreeningQuestionnaires,
  getScreeningQuestionnaire,
  createScreeningQuestionnaire,
  updateScreeningQuestionnaire,
  publishScreeningQuestionnaire,
  deleteScreeningQuestionnaire,
};

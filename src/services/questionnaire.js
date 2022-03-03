import axios from 'utils/axios';
import _ from 'lodash';

const getQuestionnaires = payload => {
  return axios.get('/questionnaire', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getQuestionnaire = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/questionnaire/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createQuestionnaire = (payload) => {
  const formData = new FormData();
  formData.append('lang', payload.lang);
  formData.append('data', JSON.stringify(payload));
  _.map(payload.questions, (question, index) => {
    if (question.file) {
      formData.append(index, question.file);
    }
  });

  return axios.post('/questionnaire', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateQuestionnaire = (id, payload) => {
  const formData = new FormData();
  formData.append('lang', payload.lang);
  formData.append('data', JSON.stringify(payload));
  _.map(payload.questions, (question, index) => {
    if (question.file) {
      if (question.file.size) {
        formData.append(index, question.file);
      } else {
        formData.append('no_changed_files[]', question.id);
      }
    }
  });

  return axios.post(`/questionnaire/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteQuestionnaire = id => {
  return axios.delete(`/questionnaire/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Questionnaire = {
  getQuestionnaire,
  getQuestionnaires,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire
};

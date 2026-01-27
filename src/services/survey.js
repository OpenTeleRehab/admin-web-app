import axios from 'utils/axios';
import _ from 'lodash';

const getSurveys = payload => {
  return axios.get('/survey', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getSurvey = (id) => {
  return axios.get(`/survey/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createSurvey = payload => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    if (Array.isArray(value) || key === 'questionnaire') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }

    _.forEach(payload?.questionnaire?.questions, (question, index) => {
      if (question.file) {
        formData.append(index, question.file);
      }
    });
  });

  return axios.post('/survey', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const updateSurvey = (id, payload) => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    if (Array.isArray(value) || key === 'questionnaire') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  _.forEach(payload?.questionnaire?.questions, (question, index) => {
    const { file, id } = question;

    // Skip if an existing file already has an ID
    if (file?.id) return;

    // Append either new file or mark as having no file
    if (file instanceof File) {
      formData.append(index, file);
    } else {
      formData.append('no_file_questions[]', id);
    }
  });

  return axios.post(`/survey/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const publishSurvey = id => {
  return axios.post(`/survey/publish/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const submitSurvey = payload => {
  return axios.post('/survey/submit', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const skipSurvey = payload => {
  return axios.post('/survey/skip', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPublishSurvey = (payload) => {
  return axios.get('survey/list/publish-survey', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const exportSurvey = (id) => {
  return axios.get('/export', { params: { id, type: 'survey_result' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Survey = {
  getSurveys,
  getSurvey,
  getPublishSurvey,
  createSurvey,
  updateSurvey,
  publishSurvey,
  submitSurvey,
  skipSurvey,
  exportSurvey
};

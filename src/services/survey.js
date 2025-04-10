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
  formData.append('lang', payload.lang);
  _.forIn(payload, (value, key) => {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
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
  formData.append('lang', payload.lang);
  _.forIn(payload, (value, key) => {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
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
  return axios.get('/get-publish-survey', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const exportSurvey = (payload) => {
  return axios.get('/survey/export', { params: payload, responseType: 'blob' })
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

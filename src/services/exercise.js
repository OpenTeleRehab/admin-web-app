import axios from 'utils/axios';
import _ from 'lodash';

const getExercises = payload => {
  return axios.get('/exercise', { params: payload })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getExercise = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';
  return axios.get(`/exercise/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createExercise = (payload, mediaUploads) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  _.forIn(mediaUploads, (value, key) => {
    if (value.file) {
      formData.append(key, value.file);
    }
  });

  return axios.post('/exercise', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateExercise = (id, payload, mediaUploads) => {
  const formData = new FormData();

  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  const oldMediaFiles = _.filter(mediaUploads, item => {
    return item.id !== undefined;
  });

  if (oldMediaFiles.length) {
    const oldMediaFileIds = _.map(oldMediaFiles, item => {
      return item.id !== undefined && item.id;
    });

    formData.append('media_files', oldMediaFileIds.toString());
  }

  _.forIn(mediaUploads, (value, key) => {
    if (value.file) {
      formData.append(key, value.file);
    }
  });

  return axios.post(`/exercise/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteExercise = id => {
  return axios.delete(`/exercise/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const downloadExercises = payload => {
  return axios.get('/exercise/export/csv', { params: payload, responseType: 'blob' })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const uploadExercises = payload => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post('/import/exercises', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const approveTranslation = (id, payload) => {
  const formData = new FormData();
  _.forIn(payload, (value, key) => {
    formData.append(key, value);
  });

  return axios.post(`/exercise/approve-translate/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

const rejectTranslation = id => {
  return axios.delete(`/exercise/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Exercise = {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  downloadExercises,
  uploadExercises,
  approveTranslation,
  rejectTranslation
};

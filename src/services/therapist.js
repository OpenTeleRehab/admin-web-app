import adminAxios from 'utils/axios';
import axios from 'axios';

window.getUserAxiosCancel = undefined;
const CancelToken = axios.CancelToken;

const createTherapist = payload => {
  return adminAxios.post('/therapist', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateTherapist = (id, payload) => {
  return adminAxios.put(`/therapist/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateTherapistStatus = (id, payload) => {
  return adminAxios.post(`/therapist/updateStatus/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTherapists = payload => {
  if (window.getUserAxiosCancel !== undefined) {
    window.getUserAxiosCancel();
  }
  return adminAxios.get('/therapist', {
    params: payload,
    cancelToken: new CancelToken(function executor (c) {
      window.getUserAxiosCancel = c;
    })
  })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      if (e.response && e.response.data) {
        return e.response.data;
      } else {
        return { success: false };
      }
    });
};

const deleteTherapistUser = (id, payload) => {
  return adminAxios.post(`/therapist/delete/by-id/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPatients = payload => {
  return adminAxios.get('/patient', {
    params: payload
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

const getPatientByTherapistIds = (therapistIds, payload) => {
  const params = { therapist_ids: therapistIds };
  return adminAxios.get('patient/list/by-therapist-ids', { params, headers: { country: payload.country_code } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPatientByTherapistId = (therapistId, isTherapistRemove = false) => {
  const params = { therapist_id: therapistId, is_therapist_remove: isTherapistRemove };
  return adminAxios.get('patient/list/by-therapist-id', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPatientForTherapistRemove = (therapistId, payload) => {
  const params = { therapist_id: therapistId };
  return adminAxios.get('patient/list/for-therapist-remove', { params, headers: { country: payload.country_code } })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getTherapistsByClinic = (clinicId) => {
  const params = { clinic_id: clinicId };
  return adminAxios.get('therapist/list/by-clinic-id', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const resendEmail = (id) => {
  return adminAxios.post(`/therapist/resend-email/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const transferPatientToTherapist = (patientId, payload) => {
  return adminAxios.post(`/patient/transfer-to-therapist/${patientId}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Therapist = {
  createTherapist,
  updateTherapist,
  getTherapists,
  deleteTherapistUser,
  getPatients,
  updateTherapistStatus,
  getPatientByTherapistIds,
  getPatientByTherapistId,
  resendEmail,
  getPatientForTherapistRemove,
  getTherapistsByClinic,
  transferPatientToTherapist
};

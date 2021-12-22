import customAxios from 'utils/therapist-axios';
import patientAxios from 'utils/patient-axios';
import axios from 'axios';

window.getUserAxiosCancel = undefined;
const CancelToken = axios.CancelToken;

const createTherapist = payload => {
  return customAxios.post('/therapist', payload)
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
  return customAxios.put(`/therapist/${id}`, payload)
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
  return customAxios.post(`/therapist/updateStatus/${id}`, payload)
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
  return customAxios.get('/therapist', {
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
  return customAxios.post(`/therapist/delete/by-id/${id}`, { country_code: payload.country_code })
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
  return patientAxios.get('/patient', {
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
  return patientAxios.get('patient/list/by-therapist-ids', { params, headers: { country: payload.country_code } })
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
  return patientAxios.get('patient/list/by-therapist-id', { params })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getPatientForTherapistRemove = (therapistId) => {
  const params = { therapist_id: therapistId };
  return patientAxios.get('patient/list/for-therapist-remove', { params })
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
  return customAxios.get('therapist/list/by-clinic-id', { params })
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
  return customAxios.post(`/therapist/resend-email/${id}`)
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
  return patientAxios.post(`/patient/transfer-to-therapist/${patientId}`, { therapist_id: payload.therapist_id, therapist_identity: payload.therapist_identity, chat_rooms: payload.chat_rooms, new_chat_rooms: payload.new_chat_rooms })
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

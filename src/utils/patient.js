import _ from 'lodash';

export const getPatient = (id, patients) => {
  const patient = _.findLast(patients, { therapist_id: parseInt(id, 10) });

  return patient ? 1 : 0;
};

export const getTotalPatient = (therapisId, patients) => {
  const totalPatients = patients.filter(p => p.therapist_id === therapisId).length;
  return totalPatients;
};

export const getTotalOnGoingTreatment = (therapisId, patients) => {
  const totalOnGoing = patients.filter(p => p.therapist_id === therapisId && !_.isEmpty(p.ongoingTreatmentPlan)).length;
  return totalOnGoing;
};

export const getTotalPatientByPhcWorker = (phcWorkerId, patients = []) => {
  const totalPatients = patients.filter(p => p.phc_worker_id === phcWorkerId).length;
  return totalPatients;
};

export const getTotalOnGoingTreatmentByPhcWorker = (phcWorkerId, patients = []) => {
  const totalOnGoing = patients.filter(p => p.phc_worker_id === phcWorkerId && !_.isEmpty(p.ongoingTreatmentPlan)).length;
  return totalOnGoing;
};

const getExercisesRequest = () => ({
  type: 'GET_EXERCISES_REQUEST'
});

const getExercisesSuccess = (data, filters) => ({
  type: 'GET_EXERCISES_SUCCESS',
  data,
  filters
});

const getExercisesFail = () => ({
  type: 'GET_EXERCISES_FAIL'
});

const getExerciseRequest = () => ({
  type: 'GET_EXERCISE_REQUEST'
});

const getExerciseSuccess = (data) => ({
  type: 'GET_EXERCISE_SUCCESS',
  data
});

const getExerciseFail = () => ({
  type: 'GET_EXERCISE_FAIL'
});

const createExercisesRequest = () => ({
  type: 'CREATE_EXERCISES_REQUEST'
});

const createExercisesSuccess = (data) => ({
  type: 'CREATE_EXERCISES_SUCCESS',
  data
});

const createExercisesFail = () => ({
  type: 'CREATE_EXERCISES_FAIL'
});

const updateExercisesRequest = () => ({
  type: 'UPDATE_EXERCISES_REQUEST'
});

const updateExercisesSuccess = (data) => ({
  type: 'UPDATE_EXERCISES_SUCCESS',
  data
});

const updateExercisesFail = () => ({
  type: 'UPDATE_EXERCISES_FAIL'
});

const deleteExercisesRequest = () => ({
  type: 'DELETE_EXERCISES_REQUEST'
});

const deleteExercisesSuccess = (data) => ({
  type: 'DELETE_EXERCISES_SUCCESS',
  data
});

const deleteExercisesFail = () => ({
  type: 'DELETE_EXERCISES_FAIL'
});

export const mutation = {
  getExercisesFail,
  getExercisesRequest,
  getExercisesSuccess,
  getExerciseRequest,
  getExerciseSuccess,
  getExerciseFail,
  createExercisesRequest,
  createExercisesSuccess,
  createExercisesFail,
  updateExercisesRequest,
  updateExercisesSuccess,
  updateExercisesFail,
  deleteExercisesRequest,
  deleteExercisesSuccess,
  deleteExercisesFail
};
import { Exercise } from 'services/exercise';
import { mutation } from './mutations';
import { showErrorNotification, showSuccessNotification } from 'store/notification/actions';

export const getExercises = () => async dispatch => {
  dispatch(mutation.getExercisesRequest());
  const data = await Exercise.getExercises();
  if (data.success) {
    dispatch(mutation.getExercisesSuccess(data.data));
  } else {
    dispatch(mutation.getExercisesFail());
    dispatch(showErrorNotification('toast_title.error_message', data.message));
  }
};

export const createExercise = payload => async (dispatch, getState) => {
  dispatch(mutation.createExercisesRequest());
  const data = await Exercise.createExercise(payload);
  if (data.success) {
    dispatch(mutation.createExercisesSuccess());
    dispatch(getExercises());
    dispatch(showSuccessNotification('toast_title.new_exercise', data.message));
    return true;
  } else {
    dispatch(mutation.createExercisesFail());
    dispatch(showErrorNotification('toast_title.new_exercise', data.message));
    return false;
  }
};

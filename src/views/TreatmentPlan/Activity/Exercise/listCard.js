import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import { BsHeart, BsHeartFill } from 'react-icons/bs';
import ViewExercise from './view';
import _ from 'lodash';

const ListExerciseCard = ({ translate, exerciseObjs, lang, customExercises }) => {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [viewExercise, setViewExercise] = useState(false);

  useEffect(() => {
    if (exerciseObjs && exerciseObjs.length > 0) {
      setExercises(exerciseObjs);
    } else {
      setExercises([]);
    }
    // eslint-disable-next-line
  }, [lang, exerciseObjs]);

  const handleView = (exercise) => {
    setExercise(exercise);
    setViewExercise(true);
  };

  const handleViewClose = () => {
    setViewExercise(false);
  };

  const renderSetsAndRepsvalue = (exercise, translate) => {
    let { sets, reps } = exercise;
    const customExercise = _.find(customExercises, { id: exercise.id });
    if (customExercise) {
      sets = customExercise.sets;
      reps = customExercise.reps;
    }

    return (
      <>
        {sets > 0 && (
          <Card.Text>
            {translate('exercise.number_of_sets_and_reps', { sets, reps })}
          </Card.Text>
        )}
      </>
    );
  };

  return (
    <>
      { exercises.map(exercise => (
        <div key={exercise.id} className="position-relative">
          <Card className="exercise-card shadow-sm mb-4">
            <div className="top-bar">
              <div className="favorite-btn btn-link">
                {exercise.is_favorite
                  ? <BsHeartFill size={20} />
                  : <BsHeart size={20} />
                }
              </div>
            </div>
            <div className="card-container" onClick={() => handleView(exercise)}>
              <div className="card-img bg-light">
                {
                  exercise.files.length > 0 && (
                    exercise.files[0].fileType === 'audio/mpeg' ? (
                      <div className="w-100">
                        <audio controls className="w-100">
                          <source src={`${process.env.REACT_APP_API_BASE_URL}/file/${exercise.files[0].id}`} type="audio/ogg" />
                        </audio>
                      </div>
                    ) : (
                      <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_API_BASE_URL}/file/${exercise.files[0].id}?thumbnail=1`} alt="Exercise" />
                    )
                  )
                }
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>
                  {
                    exercise.title.length <= 50
                      ? <h5 className="card-title">
                        { exercise.title }
                      </h5>
                      : (
                        <OverlayTrigger
                          overlay={<Tooltip id="button-tooltip-2">{ exercise.title }</Tooltip>}
                        >
                          <h5 className="card-title">
                            { exercise.title }
                          </h5>
                        </OverlayTrigger>
                      )
                  }
                </Card.Title>
                {renderSetsAndRepsvalue(exercise, translate)}
              </Card.Body>
            </div>
          </Card>
        </div>
      ))}
      { viewExercise && <ViewExercise showView={viewExercise} handleViewClose={handleViewClose} id={exercise.activity_id} /> }
    </>
  );
};
ListExerciseCard.propTypes = {
  translate: PropTypes.func,
  exerciseObjs: PropTypes.array,
  lang: PropTypes.any,
  customExercises: PropTypes.array
};

export default withLocalize(ListExerciseCard);

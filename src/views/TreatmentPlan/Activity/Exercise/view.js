import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import { Form } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector } from 'react-redux';
import Dialog from 'components/Dialog';

const ViewExercise = ({ showView, handleViewClose, exercise }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Dialog
      show={showView}
      title={exercise.title}
      cancelLabel={translate('common.close')}
      onCancel={handleViewClose}
    >
      <Form>
        <Carousel activeIndex={index} onSelect={handleSelect} controls={exercise.files.length > 1} indicators={exercise.files.length > 1} className="view-exercise-carousel">
          { exercise.files.map((file, index) => (
            <Carousel.Item key={index}>
              { file.fileType === 'audio/mpeg' &&
              <div className="img-thumbnail w-100 pt-2 pl-5 pr-5 bg-light audio-wrapper">
                <audio controls className="w-100 mt-4">
                  <source src={file.url || `${process.env.REACT_APP_API_BASE_URL}/file/${file.id}`} type="audio/ogg" />
                </audio>
              </div>
              }
              { (file.fileType !== 'audio/mpeg' && file.fileType !== 'video/mp4') &&
              <img
                className="d-block w-100"
                src={file.url || `${process.env.REACT_APP_API_BASE_URL}/file/${file.id}`} alt="..."
              />
              }

              { file.fileType === 'video/mp4' &&
              <video className="w-100 img-thumbnail" controls>
                <source src={file.url || `${process.env.REACT_APP_API_BASE_URL}/file/${file.id}`} type="video/mp4" />
              </video>
              }
            </Carousel.Item>
          ))}
        </Carousel>

        {exercise.sets > 0 && (
          <p className="mt-2">
            {translate('exercise.number_of_sets_and_reps', { sets: exercise.sets, reps: exercise.reps })}
          </p>
        )}

        <div className="mt-2">
          { exercise.additional_fields && exercise.additional_fields.map((additionalField, index) => (
            <div key={index}>
              <strong>{additionalField.field}</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>{additionalField.value}</p>
            </div>
          ))}
        </div>

        {exercise.additional_information && (
          <div>
            <strong>{translate('exercise.additional_information')}</strong>
            <p>{exercise.additional_information}</p>
          </div>
        )}
      </Form>
    </Dialog>
  );
};

ViewExercise.propTypes = {
  showView: PropTypes.bool,
  handleViewClose: PropTypes.func,
  exercise: PropTypes.object
};

export default ViewExercise;

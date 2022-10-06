import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTranslate } from 'react-localize-redux';
import { Col, Form, Row } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { useSelector } from 'react-redux';
import Dialog from 'components/Dialog';
import GoogleTranslationAttribute from '../../../components/GoogleTranslationAttribute';

const ViewExercise = ({ showView, handleViewClose, id }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { exercises } = useSelector(state => state.exercise);
  const [exercise, seExercise] = useState({});
  const [title, setTitle] = useState('');
  const [mediaUploads, setMediaUploads] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    if (id && exercises.length) {
      const data = exercises.find(exercise => exercise.id === id);
      seExercise(data);
      setTitle(data.title);
      setMediaUploads(data.files);
      setAdditionalFields(data.additional_fields);
    }
  }, [id, exercises]);

  return (
    <Dialog
      show={showView}
      title={title}
      cancelLabel={translate('common.close')}
      onCancel={handleViewClose}
    >
      <Form>
        <Row>
          <Col sm={12} xl={12}>
            <Carousel activeIndex={index} onSelect={handleSelect} controls={mediaUploads.length > 1} indicators={mediaUploads.length > 1} className="view-exercise-carousel">
              { mediaUploads.map((mediaUpload, index) => (
                <Carousel.Item key={index}>
                  { mediaUpload.fileType === 'audio/mpeg' &&
                    <div className="img-thumbnail w-100 pt-2 pl-5 pr-5 bg-light audio-wrapper">
                      <audio controls className="w-100 mt-4">
                        <source src={mediaUpload.url || `${process.env.REACT_APP_API_BASE_URL}/file/${mediaUpload.id}`} type="audio/ogg" />
                      </audio>
                    </div>
                  }
                  { (mediaUpload.fileType !== 'audio/mpeg' && mediaUpload.fileType !== 'video/mp4') &&
                    <img
                      className="d-block w-100"
                      src={mediaUpload.url || `${process.env.REACT_APP_API_BASE_URL}/file/${mediaUpload.id}`} alt="..."
                    />
                  }

                  { mediaUpload.fileType === 'video/mp4' &&
                    <video className="w-100 img-thumbnail" controls>
                      <source src={mediaUpload.url || `${process.env.REACT_APP_API_BASE_URL}/file/${mediaUpload.id}`} type="video/mp4" />
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

            <div className="mt-4">
              { additionalFields && additionalFields.map((additionalField, index) => (
                <div key={index}>
                  <strong>{additionalField.field}</strong>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{additionalField.value}</p>
                </div>
              ))}
            </div>
            { exercise.auto_translated === true && (
              <GoogleTranslationAttribute />
            )}
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};

ViewExercise.propTypes = {
  showView: PropTypes.bool,
  handleViewClose: PropTypes.func,
  id: PropTypes.string
};

export default ViewExercise;

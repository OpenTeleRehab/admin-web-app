import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Row,
  Col,
  Card,
  Form,
  Tooltip,
  OverlayTrigger,
  Button
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BsSearch, BsX } from 'react-icons/bs';

import Dialog from 'components/Dialog';
import Pagination from 'components/Pagination';
import { deleteExercise, getExercises } from 'store/exercise/actions';
import * as ROUTES from 'variables/routes';
import Spinner from 'react-bootstrap/Spinner';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import ViewExercise from './view';

let timer = null;
const Exercise = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, exercises, filters } = useSelector(state => state.exercise);
  const { profile } = useSelector((state) => state.auth);
  const { languages } = useSelector(state => state.language);
  const [id, setId] = useState(null);
  const [showView, setShowView] = useState(false);

  const [deletedId, setDeletedId] = useState(null);
  const [show, setShow] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [language, setLanguage] = useState('');
  const [formFields, setFormFields] = useState({
    search_value: ''
  });

  useEffect(() => {
    if (filters && filters.lang) {
      setLanguage(filters.lang);
    } else if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    }
  }, [filters, profile]);

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getExercises({
        lang: language,
        filter: formFields,
        page_size: pageSize,
        page: currentPage
      })).then(result => {
        if (result) {
          setTotalCount(result.total_count);
        }
      });
    }, 500);
  }, [language, formFields, currentPage, pageSize, dispatch]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
  };

  const handleDelete = (id) => {
    setDeletedId(id);
    setShow(true);
  };

  const handleClose = () => {
    setDeletedId(null);
    setShow(false);
  };

  const handleConfirm = () => {
    dispatch(deleteExercise(deletedId)).then(result => {
      if (result) {
        handleClose();
      }
    });
  };

  const handleEdit = (id) => {
    history.push(ROUTES.EXERCISE_EDIT.replace(':id', id));
  };

  const handleView = (id) => {
    setId(id);
    setShowView(true);
  };

  const handleViewClose = () => {
    setId('');
    setShowView(false);
  };

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={3}>
          <Card bg="info">
            <Card.Header>
              <Form.Group className="search-box-with-icon">
                <BsSearch className="search-icon" />
                <Button
                  variant="light"
                  className="clear-btn"
                  onClick={handleClearSearch}
                >
                  <BsX size={18} />
                </Button>
                <Form.Control
                  name="search_value"
                  value={formFields.search_value}
                  onChange={handleChange}
                  placeholder={translate('exercise.search')}
                />
              </Form.Group>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('placeholder.category_item')}</option>
                  <option>{translate('placeholder.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('placeholder.category_item')}</option>
                  <option>{translate('placeholder.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.category')}</Form.Label>
                <Form.Control as="select" disabled>
                  <option>{translate('placeholder.category_item')}</option>
                  <option>{translate('placeholder.category_item')}</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>{translate('common.language')}</Form.Label>
                <Form.Control as="select" value={language} onChange={handleLanguageChange}>
                  {languages.map((language, index) => (
                    <option key={index} value={language.id}>
                      {language.name} {language.code === language.fallback && `(${translate('common.default')})`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={7} md={8} lg={9}>
          { exercises.length === 0 && (
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <big className="text-muted">{translate('common.no_data')}</big>
            </div>
          )}
          { exercises.length > 0 && (
            <>
              <Row>
                { exercises.map(exercise => (
                  <Col key={exercise.id} md={6} lg={3}>
                    <div className="position-absolute delete-btn">
                      <DeleteAction disabled={!exercise.can_delete} onClick={() => handleDelete(exercise.id)} />
                    </div>
                    <div className="position-absolute edit-btn">
                      <EditAction onClick={() => handleEdit(exercise.id)} />
                    </div>
                    <Card className="exercise-card shadow-sm mb-4" onClick={() => handleView(exercise.id)}>
                      <div className="card-img bg-light">
                        {
                          exercise.files.length > 0 && (
                            (exercise.files[0].fileType === 'audio/mpeg' &&
                              <div className="w-100 pt-5 pl-3 pr-3">
                                <audio controls className="w-100">
                                  <source src={`${process.env.REACT_APP_API_BASE_URL}/file/${exercise.files[0].id}`} type="audio/ogg" />
                                </audio>
                              </div>
                            ) ||
                            (exercise.files[0].fileType === 'video/mp4' &&
                              <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_API_BASE_URL}/file/${exercise.files[0].id}/?thumbnail=1`} alt="Exercise"
                              />
                            ) ||
                            ((exercise.files[0].fileType !== 'audio/mpeg' && exercise.files[0].fileType !== 'video/mp4') &&
                              <img className="img-fluid mx-auto d-block" src={`${process.env.REACT_APP_API_BASE_URL}/file/${exercise.files[0].id}`} alt="Exercise"
                              />
                            )
                          )
                        }
                      </div>
                      <Card.Body>
                        <Card.Title>
                          {
                            exercise.title.length <= 50
                              ? <h5 className="card-title">{ exercise.title }</h5>
                              : (
                                <OverlayTrigger
                                  overlay={<Tooltip id="button-tooltip-2">{ exercise.title }</Tooltip>}
                                >
                                  <h5 className="card-title">{ exercise.title }</h5>
                                </OverlayTrigger>
                              )
                          }
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageSizes={[8, 16, 24, 32, 40]}
              />
            </>
          )}

          { loading && <Spinner className="loading-icon" animation="border" variant="primary" /> }
        </Col>
      </Row>
      {showView && <ViewExercise showView={showView} handleViewClose={handleViewClose} id={id} />}
      <Dialog
        show={show}
        title={translate('exercise.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
    </>
  );
};

Exercise.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(Exercise);

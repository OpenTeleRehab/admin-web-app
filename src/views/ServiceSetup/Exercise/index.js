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
  Accordion,
  Button
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import Dialog from 'components/Dialog';
import Pagination from 'components/Pagination';
import {
  EditAction,
  DeleteAction,
  TranslateAction
} from 'components/ActionIcons';
import {
  deleteExercise, downloadExercises,
  getExercises
} from 'store/exercise/actions';
import SearchInput from 'components/Form/SearchInput';
import * as ROUTES from 'variables/routes';
import ViewExercise from './view';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import CheckboxTree from 'react-checkbox-tree';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsSquare,
  BsDashSquare
} from 'react-icons/bs';
import { FaRegCheckSquare } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';
import _ from 'lodash';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';
import { USER_GROUPS, USER_ROLES } from '../../../variables/user';
import customColorScheme from '../../../utils/customColorScheme';

let timer = null;
const Exercise = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const isTranslating = keycloak.hasRealmRole(USER_ROLES.TRANSLATE_EXERCISE);

  const { loading, exercises, filters, totalCount } = useSelector(state => state.exercise);
  const { profile } = useSelector((state) => state.auth);
  const { languages } = useSelector(state => state.language);
  const { categoryTreeData } = useSelector((state) => state.category);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [id, setId] = useState(null);
  const [showView, setShowView] = useState(false);

  const [deletedId, setDeletedId] = useState(null);
  const [show, setShow] = useState(false);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const [language, setLanguage] = useState(undefined);
  const [formFields, setFormFields] = useState({
    search_value: ''
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (filters && filters.lang) {
      setLanguage(filters.lang);
    } else if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    } else {
      setLanguage(undefined);
    }
  }, [filters, profile]);

  useEffect(() => {
    if (language !== undefined) {
      dispatch(
        getCategoryTreeData({ type: CATEGORY_TYPES.EXERCISE, lang: language }));
    }
  }, [language, dispatch]);

  useEffect(() => {
    if (categoryTreeData.length) {
      const rootCategoryStructure = {};
      categoryTreeData.forEach(category => {
        rootCategoryStructure[category.value] = [];
      });
      setSelectedCategories(rootCategoryStructure);
    }
  }, [categoryTreeData]);

  useEffect(() => {
    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(getExercises({
        lang: language,
        filter: formFields,
        categories: serializedSelectedCats,
        page_size: pageSize,
        page: currentPage
      }));
    }, 500);
  }, [language, formFields, selectedCategories, currentPage, pageSize, dispatch]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setFormFields({ ...formFields, search_value: '' });
    setCurrentPage(1);
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

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
    setCurrentPage(1);
  };

  const handleDownload = () => {
    setDownloading(true);
    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });
    dispatch(downloadExercises({ lang: language, filter: formFields, categories: serializedSelectedCats }))
      .then(() => { setDownloading(false); });
  };

  const handleCheckBoxChange = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
    setCurrentPage(1);
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  return (
    <>
      <Row>
        <Col sm={5} md={4} lg={3}>
          <Card bg="info">
            <Card.Header>
              <SearchInput
                name="search_value"
                value={formFields.search_value}
                placeholder={translate('education_material.search')}
                onChange={handleChange}
                onClear={handleClearSearch}
              />
            </Card.Header>
            <Card.Body>
              {isTranslating &&
                <Form.Group>
                  <Form.Check
                    custom
                    type="checkbox"
                    name="suggestions"
                    label={translate('exercise.show_suggestions')}
                    id="showSuggestions"
                    onChange={handleCheckBoxChange}
                  />
                </Form.Group>
              }
              <Form.Group>
                <Form.Label>{translate('common.language')}</Form.Label>
                <Select
                  classNamePrefix="filter"
                  value={languages.filter(option => option.id === language)}
                  getOptionLabel={option => option.name}
                  options={languages}
                  onChange={(e) => setLanguage(e.id)}
                  styles={customSelectStyles}
                  aria-label="Language"
                />
              </Form.Group>
              <Accordion>
                {
                  categoryTreeData.map(category => (
                    <Card key={category.value} className="mb-3 rounded">
                      <Accordion.Toggle eventKey={category.value} className="d-flex align-items-center card-header border-0">
                        <span className="text-truncate pr-2">{category.label}</span>
                        <div className="ml-auto text-nowrap">
                          <span className="mr-3">
                            {selectedCategories[category.value] ? selectedCategories[category.value].length : 0}
                          </span>
                          <ContextAwareToggle eventKey={category.value.toString()} />
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={category.value}>
                        <Card.Body>
                          <CheckboxTree
                            nodes={category.children || []}
                            checked={selectedCategories[category.value] ? selectedCategories[category.value] : []}
                            expanded={expanded}
                            onCheck={checked => handleSetSelectedCategories(category.value, checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={{
                              check: <FaRegCheckSquare size={40} color="black" />,
                              uncheck: <BsSquare size={40} color="black" />,
                              halfCheck: <BsDashSquare size={40} color="black" />,
                              expandClose: <BsCaretRightFill size={40} color="black" />,
                              expandOpen: <BsCaretDownFill size={40} color="black" />
                            }}
                            showNodeIcon={false}
                          />
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))
                }
              </Accordion>
              <Button aria-label="Dowload Exercise" block onClick={() => handleDownload()} disabled={downloading}>
                {translate('exercise.download')}
              </Button>
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
                    {!!exercise.children.length && isTranslating &&
                      <div className="position-absolute delete-btn">
                        <TranslateAction onClick={() => {}} tooltip={'common.translation_suggested'} />
                      </div>
                    }
                    { profile.type !== USER_GROUPS.ORGANIZATION_ADMIN && !isTranslating &&
                      <div className="position-absolute delete-btn">
                        <DeleteAction onClick={() => handleDelete(exercise.id)} />
                      </div>
                    }
                    { (profile.type !== USER_GROUPS.ORGANIZATION_ADMIN || isTranslating) &&
                      <div className="position-absolute edit-btn">
                        <EditAction onClick={() => handleEdit(exercise.id)} />
                      </div>
                    }
                    <Card className="exercise-card shadow-sm mb-4" role="button" tabIndex="0" onClick={() => handleView(exercise.id)} onKeyPress={(e) => e.key === 'Enter' && handleView(exercise.id)}>
                      <div className="card-img bg-light">
                        {
                          exercise.files.length > 0 && (
                            exercise.files[0].fileType === 'audio/mpeg' ? (
                              <div className="w-100 pt-5 pl-3 pr-3">
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
                        {exercise.sets > 0 && (
                          <Card.Text>
                            {translate('exercise.number_of_sets_and_reps', { sets: exercise.sets, reps: exercise.reps })}
                          </Card.Text>
                        )}
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
                pageSizes={[60, 120, 180, 240]}
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
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

Exercise.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(Exercise);

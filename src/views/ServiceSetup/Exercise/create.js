import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
  Card,
  Accordion
} from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsUpload,
  BsXCircle,
  BsX,
  BsCaretDownFill,
  BsCaretRightFill,
  BsSquare,
  BsDashSquare, BsPlusCircle
} from 'react-icons/bs';
import { FaRegCheckSquare } from 'react-icons/fa';
import CheckboxTree from 'react-checkbox-tree';

import * as ROUTES from 'variables/routes';
import {
  createExercise,
  getExercise,
  updateExercise
} from 'store/exercise/actions';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import _ from 'lodash';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import { TABS } from 'variables/exercises';
import Upload from './upload';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';

const CreateExercise = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const { languages } = useSelector(state => state.language);
  const { exercise, filters } = useSelector(state => state.exercise);
  const { categoryTreeData } = useSelector((state) => state.category);

  const [language, setLanguage] = useState('');
  const [formFields, setFormFields] = useState({
    title: '',
    include_feedback: true,
    get_pain_level: '',
    show_sets_reps: false,
    sets: '',
    reps: ''
  });
  const [additionalFields, setAdditionalFields] = useState([]);

  const [titleError, setTitleError] = useState(false);
  const [setsError, setSetsError] = useState(false);
  const [repsError, setRepsError] = useState(false);
  const [mediaUploads, setMediaUploads] = useState([]);
  const [mediaUploadsError, setMediaUploadsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFieldError, setInputFieldError] = useState([]);
  const [inputValueError, setInputValueError] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [expanded, setExpanded] = useState([]);
  const [tab, setTab] = useState(TABS.CREATE);

  useEffect(() => {
    if (languages.length) {
      if (id && filters && filters.lang) {
        setLanguage(filters.lang);
      } else {
        setLanguage(languages[0].id);
      }
    }
  }, [languages, filters, id]);

  useEffect(() => {
    dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.EXERCISE, lang: language }));
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
    if (id) {
      dispatch(getExercise(id, language));
    }
  }, [id, language, dispatch]);

  useEffect(() => {
    if (id && exercise.id) {
      const showSetsReps = exercise.sets > 0;
      setFormFields({
        title: exercise.title,
        include_feedback: showSetsReps && exercise.include_feedback,
        get_pain_level: exercise.get_pain_level,
        show_sets_reps: showSetsReps,
        sets: exercise.sets,
        reps: exercise.reps
      });
      setAdditionalFields(exercise.additional_fields);
      setMediaUploads(exercise.files);
      if (categoryTreeData.length) {
        const rootCategoryStructure = {};
        categoryTreeData.forEach(category => {
          const ids = [];
          JSON.stringify(category, (key, value) => {
            if (key === 'value') ids.push(value);
            return value;
          });
          rootCategoryStructure[category.value] = _.intersectionWith(exercise.categories, ids);
        });
        setSelectedCategories(rootCategoryStructure);
      }
    }
  }, [id, exercise, categoryTreeData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleChangeInput = (index, e) => {
    const values = [...additionalFields];
    values[index][e.target.name] = e.target.value;
    setAdditionalFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...additionalFields];
    values.splice(index, 1);
    setAdditionalFields(values);
  };

  const handleAddFields = () => {
    setAdditionalFields([...additionalFields, { field: '', value: '' }]);
    setTimeout(() => {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
  };

  const enableButtons = () => {
    const languageObj = languages.find(item => item.id === parseInt(language, 10));
    return languageObj && languageObj.code === languageObj.fallback;
  };

  const handleSave = () => {
    let canSave = true;

    if (formFields.title === '') {
      canSave = false;
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    if (mediaUploads.length === 0) {
      canSave = false;
      setMediaUploadsError(true);
    } else {
      setMediaUploadsError(false);
    }

    const errorInputFields = [];
    const errorValueFields = [];
    for (let i = 0; i < additionalFields.length; i++) {
      if (additionalFields[i].field === '') {
        canSave = false;
        errorInputFields.push(true);
      } else {
        errorInputFields.push(false);
      }

      if (additionalFields[i].value === '') {
        canSave = false;
        errorValueFields.push(true);
      } else {
        errorValueFields.push(false);
      }
    }
    setInputFieldError(errorInputFields);
    setInputValueError(errorValueFields);

    if (formFields.show_sets_reps) {
      if (formFields.sets > 0) {
        setSetsError(false);
      } else {
        canSave = false;
        setSetsError(true);
      }

      if (formFields.reps > 0) {
        setRepsError(false);
      } else {
        canSave = false;
        setRepsError(true);
      }
    } else {
      setSetsError(false);
      setRepsError(false);
    }

    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    if (canSave) {
      setIsLoading(true);
      const payload = {
        ...formFields,
        sets: formFields.show_sets_reps ? formFields.sets : 0,
        reps: formFields.show_sets_reps ? formFields.reps : 0,
        include_feedback: formFields.show_sets_reps && formFields.include_feedback,
        additional_fields: JSON.stringify(additionalFields),
        categories: serializedSelectedCats,
        lang: language
      };
      if (id) {
        dispatch(updateExercise(id, payload, mediaUploads))
          .then(result => {
            if (result) {
              history.push(ROUTES.SERVICE_SETUP);
            }
            setIsLoading(false);
          });
      } else {
        dispatch(createExercise(payload, mediaUploads))
          .then(result => {
            if (result) {
              history.push(ROUTES.SERVICE_SETUP);
            }
            setIsLoading(false);
          });
      }
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const fileObj = [];
    fileObj.push(files);
    let i;
    for (i = 0; i < fileObj[0].length; i++) {
      const file = fileObj[0][i];
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(2);
      const fileType = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        mediaUploads.push({ url: reader.result, fileName, fileSize, fileType, file });
        setMediaUploads([...mediaUploads]);
      };
    }
  };
  const handleFileRemove = (index) => {
    const mediaFiles = mediaUploads;
    if (index !== -1) {
      mediaFiles.splice(index, 1);
      setMediaUploads([...mediaFiles]);
    }
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
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

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{id ? translate('exercise.edit') : translate('exercise.create')}</h1>
      </div>

      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        {
          !id && (
            <Form.Group as={Row}>
              <Col sm={4} lg={3} xl={2}>
                <Form.Check
                  name="option"
                  onChange={() => setTab(TABS.CREATE)}
                  value={1}
                  defaultChecked
                  type="radio"
                  label={translate('exercise.single_upload')}
                  id="formSingleOption"
                />
              </Col>
              <Col>
                <Form.Check
                  name="option"
                  onChange={() => setTab(TABS.UPLOAD)}
                  value={2}
                  type="radio"
                  label={translate('exercise.bulk_upload')}
                  id="formBulkOption"
                />
              </Col>
            </Form.Group>
          )
        }

        {tab === TABS.CREATE &&
          <Row>
            <Col sm={4} xl={3}>
              <div className="exercise-media">
                <h4>{translate('exercise.media')}</h4>
                { mediaUploads.map((mediaUpload, index) => (
                  <div key={index} className="mb-2 position-relative w-75" >
                    <div className="position-absolute remove-btn-wrapper">
                      <BsXCircle size={20} onClick={() => handleFileRemove(index)}/>
                    </div>

                    { mediaUpload.fileType === 'audio/mpeg' &&
                      <div className="img-thumbnail w-100 pt-2">
                        <audio controls className="w-100">
                          <source src={mediaUpload.url || `${process.env.REACT_APP_API_BASE_URL}/file/${mediaUpload.id}`} type="audio/ogg" />
                        </audio>
                      </div>
                    }

                    { (mediaUpload.fileType !== 'audio/mpeg' && mediaUpload.fileType !== 'video/mp4') &&
                      <img src={mediaUpload.url || `${process.env.REACT_APP_API_BASE_URL}/file/${mediaUpload.id}`} alt="..." className="w-100 img-thumbnail"/>
                    }

                    { mediaUpload.fileType === 'video/mp4' &&
                      <video className="w-100 img-thumbnail" controls>
                        <source src={mediaUpload.url || `${process.env.REACT_APP_API_BASE_URL}/file/${mediaUpload.id}`} type="video/mp4" />
                      </video>
                    }
                    <div>{mediaUpload.fileName} {mediaUpload.fileSize ? ('(' + mediaUpload.fileSize + 'kB )') : ''}</div>
                  </div>
                ))}
                <div className="btn btn-sm bg-white btn-outline-primary text-primary position-relative overflow-hidden" >
                  <BsUpload size={15}/> Upload Image
                  <input type="file" name="file" className="position-absolute upload-btn" onChange={handleFileChange} multiple accept="audio/*, video/*, image/*" aria-label="Upload"/>
                </div>
                { mediaUploadsError &&
                  <div className="text-danger">{translate('exercise.media_upload.required')}</div>
                }
              </div>
            </Col>
            <Col sm={7} xl={8} className="mb-5">
              <Form.Group controlId="formLanguage">
                <Form.Label>{translate('common.show_language.version')}</Form.Label>
                <Select
                  isDisabled={!id}
                  classNamePrefix="filter"
                  value={languages.filter(option => option.id === language)}
                  getOptionLabel={option => option.name}
                  options={languages}
                  onChange={(e) => setLanguage(e.id)}
                  styles={customSelectStyles}
                  aria-label="Language"
                />
              </Form.Group>
              <h4>{translate('exercise.information')}</h4>
              <Form.Group controlId="formTitle">
                <Form.Label>{translate('exercise.title')}</Form.Label>
                <span className="text-dark ml-1">*</span>
                <Form.Control
                  name="title"
                  onChange={handleChange}
                  value={formFields.title}
                  placeholder={translate('exercise.title.placeholder')}
                  isInvalid={titleError}
                />
                <Form.Control.Feedback type="invalid">
                  {translate('exercise.title.required')}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formShowSetsReps">
                <Form.Check
                  name="show_sets_reps"
                  onChange={handleCheck}
                  value={true}
                  checked={formFields.show_sets_reps}
                  label={translate('exercise.set_efault_exercise_sets_and_reps')}
                />
              </Form.Group>
              {formFields.show_sets_reps && (
                <Card bg="light" body className="mb-3">
                  <Form.Row>
                    <Form.Group as={Col} controlId="formSets">
                      <Form.Label>{translate('exercise.sets')}</Form.Label>
                      <span className="text-dark ml-1">*</span>
                      <Form.Control
                        type="number"
                        name="sets"
                        placeholder={translate('exercise.sets.placeholder')}
                        value={formFields.sets}
                        onChange={handleChange}
                        isInvalid={setsError}
                      />
                      <Form.Control.Feedback type="invalid">
                        {translate('exercise.sets.required')}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>{translate('exercise.reps')}</Form.Label>
                      <span className="text-dark ml-1">*</span>
                      <Form.Control
                        type="number"
                        name="reps"
                        placeholder={translate('exercise.reps.placeholder')}
                        value={formFields.reps}
                        onChange={handleChange}
                        isInvalid={repsError}
                      />
                      <Form.Control.Feedback type="invalid">
                        {translate('exercise.reps.required')}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Group controlId="formIncludeFeedback">
                    <Form.Check
                      name="include_feedback"
                      onChange={handleCheck}
                      value={true}
                      checked={formFields.include_feedback}
                      label={translate('exercise.include_collecting_feedback')}
                    />
                  </Form.Group>
                </Card>
              )}
              <Form.Group controlId="formGetPainLevel">
                <Form.Check
                  name="get_pain_level"
                  onChange={handleCheck}
                  value={true}
                  checked={formFields.get_pain_level}
                  label={translate('exercise.get_pain_level_feedback')}
                />
              </Form.Group>

              <Accordion className="mb-3" defaultActiveKey={1}>
                {
                  categoryTreeData.map((category, index) => (
                    <Card key={index}>
                      <Accordion.Toggle as={Card.Header} eventKey={index + 1} className="d-flex align-items-center">
                        {category.label}
                        <div className="ml-auto">
                          <span className="mr-3">
                            {selectedCategories[category.value] ? selectedCategories[category.value].length : 0} {translate('category.selected')}
                          </span>
                          <ContextAwareToggle eventKey={index + 1} />
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={index + 1}>
                        <Card.Body>
                          <CheckboxTree
                            nodes={category.children || []}
                            checked={selectedCategories[category.value] ? selectedCategories[category.value] : []}
                            expanded={expanded}
                            onCheck={(checked) => handleSetSelectedCategories(category.value, checked)}
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

              {
                additionalFields.map((additionalField, index) => (
                  <Card key={index} className="bg-light mb-3 additional-field">
                    <Card.Body>
                      {enableButtons() &&
                        <div className="remove-btn-container">
                          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('common.remove')}</Tooltip>}>
                            <Button
                              aria-label="Remove field"
                              variant="outline-danger"
                              className="btn-remove"
                              onClick={() => handleRemoveFields(index)}
                            >
                              <BsX size={20} />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      }
                      <Form.Group controlId={`formLabel${index}`}>
                        <Form.Label>{translate('exercise.additional_field.label')}</Form.Label>
                        <span className="text-dark ml-1">*</span>
                        <Form.Control
                          name="field"
                          placeholder={translate('exercise.additional_field.placeholder.label')}
                          value={additionalField.field}
                          onChange={e => handleChangeInput(index, e)}
                          isInvalid={inputFieldError[index]}
                        />
                        <Form.Control.Feedback type="invalid">
                          {translate('exercise.additional_field.label.required')}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId={`formValue${index}`}>
                        <Form.Label>{translate('exercise.additional_field.value')}</Form.Label>
                        <span className="text-dark ml-1">*</span>
                        <Form.Control
                          name="value"
                          as="textarea"
                          rows={3}
                          placeholder={translate('exercise.additional_field.placeholder.value')}
                          value={additionalField.value}
                          onChange={event => handleChangeInput(index, event)}
                          isInvalid={inputValueError[index]}
                        />
                        <Form.Control.Feedback type="invalid">
                          {translate('exercise.additional_field.value.required')}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                ))
              }

              { enableButtons() &&
                <Form.Group>
                  <Button
                    aria-label="Add more field"
                    variant="link"
                    onClick={handleAddFields}
                    className="p-0 mr-1"
                  >
                    <BsPlusCircle size={20} /> {translate('exercise.additional_field.add_more_field')}
                  </Button>
                </Form.Group>
              }
            </Col>
          </Row>
        }
        <Row>
          <Col sm={12} xl={11} className="question-wrapper">
            <div className="sticky-btn d-flex justify-content-end">
              <div className="py-2 questionnaire-save-cancel-wrapper px-3">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {translate('common.save')}
                </Button>
                <Button
                  className="ml-2"
                  variant="outline-dark"
                  as={Link}
                  to={ROUTES.SERVICE_SETUP}
                  disabled={isLoading}
                >
                  {translate('common.cancel')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {tab === TABS.UPLOAD &&
          <Upload />
        }
      </Form>
    </>
  );
};

CreateExercise.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(CreateExercise);

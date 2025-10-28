import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Button, Col, Form, Row, Accordion, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as ROUTES from '../../../variables/routes';
import {
  approveTranslation,
  createQuestionnaire,
  getQuestionnaire, rejectTranslation,
  updateQuestionnaire
} from '../../../store/questionnaire/actions';
import Question from './Question/question';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
import { useKeycloak } from '@react-keycloak/web';
import _ from 'lodash';
import CheckboxTree from 'react-checkbox-tree';
import {
  BsCaretDownFill,
  BsCaretRightFill,
  BsSquare,
  BsDashSquare, BsPlusCircle
} from 'react-icons/bs';
import { FaRegCheckSquare } from 'react-icons/fa';
import { ContextAwareToggle } from 'components/Accordion/ContextAwareToggle';
import scssColors from '../../../scss/custom.scss';
import Select from 'react-select';
import customColorScheme from '../../../utils/customColorScheme';
import Dialog from '../../../components/Dialog';
import { USER_ROLES } from '../../../variables/user';
import SelectLanguage from '../_Partials/SelectLanguage';
import FallbackText from '../../../components/Form/FallbackText';

const CreateQuestionnaire = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const { id } = useParams();
  const isTranslating = keycloak.hasRealmRole(USER_ROLES.TRANSLATE_EXERCISE);

  const { languages } = useSelector(state => state.language);
  const { questionnaire, filters } = useSelector(state => state.questionnaire);
  const { categoryTreeData } = useSelector((state) => state.category);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [language, setLanguage] = useState('');
  const [formFields, setFormFields] = useState({
    title: '',
    description: ''
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const [titleError, setTitleError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([{ title: '', type: 'checkbox', answers: [{ description: '' }, { description: '' }], file: null }]);
  const [questionTitleError, setQuestionTitleError] = useState([]);
  const [answerFieldError, setAnswerFieldError] = useState([]);
  const [answerValueError, setAnswerValueError] = useState([]);
  const [answerThresholdError, setAnswerThresholdError] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  const [editTranslations, setEditTranslations] = useState([]);
  const [editTranslationIndex, setEditTranslationIndex] = useState(1);
  const [editTranslation, setEditTranslation] = useState(null);
  const [showFallbackText, setShowFallbackText] = useState(false);

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
    dispatch(getCategoryTreeData({ type: CATEGORY_TYPES.QUESTIONNAIRE, lang: language }));
  }, [language, dispatch]);

  useEffect(() => {
    if (id && language) {
      dispatch(getQuestionnaire(id, language));
    }
  }, [id, language, dispatch]);

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
    if (id && questionnaire.id) {
      if (_.isEmpty(editTranslation)) {
        setFormFields({
          title: questionnaire.title,
          description: questionnaire.description,
          include_at_the_start: questionnaire.include_at_the_start,
          include_at_the_end: questionnaire.include_at_the_end,
          share_with_phc_worker: questionnaire.share_with_phc_worker
          // share_to_hi_library: questionnaire.share_to_hi_library
        });
        setQuestions(questionnaire.questions);
        setShowFallbackText(false);
      } else {
        setFormFields({
          title: editTranslation.title,
          description: editTranslation.description,
          include_at_the_start: editTranslation.include_at_the_start,
          include_at_the_end: editTranslation.include_at_the_end
          // share_to_hi_library: editTranslation.share_to_hi_library
        });
        setQuestions(editTranslation.questions);
        setShowFallbackText(true);
      }
      if (categoryTreeData.length) {
        const rootCategoryStructure = {};
        categoryTreeData.forEach(category => {
          const ids = [];
          JSON.stringify(category, (key, value) => {
            if (key === 'value') ids.push(value);
            return value;
          });
          rootCategoryStructure[category.value] = _.intersectionWith(questionnaire.categories, ids);
        });
        setSelectedCategories(rootCategoryStructure);
      }
    }
  }, [id, questionnaire, categoryTreeData, editTranslation]);

  useEffect(() => {
    if (!_.isEmpty(editTranslations)) {
      setEditTranslation(editTranslations[editTranslationIndex - 1]);
    } else {
      setEditTranslation(null);
    }
    // eslint-disable-next-line
  }, [editTranslations, editTranslationIndex]);

  useEffect(() => {
    if (id && questionnaire.is_used) {
      setIsUsed(true);
    }
  }, [id, questionnaire]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleSave = () => {
    let canSave = true;
    const errorQuestionTitle = [];
    const errorAnswerField = [];
    const errorAnswerValue = [];
    const errorAnswerThreshold = [];

    if (formFields.title === '') {
      canSave = false;
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].title === '') {
        canSave = false;
        errorQuestionTitle.push(true);
      } else {
        errorQuestionTitle.push(false);
      }
    }

    for (let i = 0; i < questions.length; i++) {
      errorAnswerField.push([]);
      errorAnswerValue.push([]);
      errorAnswerThreshold.push([]);
      for (let j = 0; j < questions[i].answers.length; j++) {
        if (questions[i].type !== 'open-number' && questions[i].answers[j].description === '') {
          canSave = false;
          errorAnswerField[i].push(true);
        } else {
          errorAnswerField[i].push(false);
        }

        if (questions[i].mark_as_countable && questions[i].answers[j].value === '') {
          canSave = false;
          errorAnswerValue[i].push(true);
        } else {
          errorAnswerValue[i].push(false);
        }

        if (questions[i].type === 'open-number' && questions[i].mark_as_countable && questions[i].answers[j].threshold === '') {
          canSave = false;
          errorAnswerThreshold[i].push(true);
        } else {
          errorAnswerThreshold[i].push(false);
        }
      }
    }
    setQuestionTitleError(errorQuestionTitle);
    setAnswerFieldError(errorAnswerField);
    setAnswerValueError(errorAnswerValue);
    setAnswerThresholdError(errorAnswerThreshold);

    let serializedSelectedCats = [];
    Object.keys(selectedCategories).forEach(function (key) {
      serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
    });

    if (canSave) {
      setIsLoading(true);
      if (id) {
        dispatch(updateQuestionnaire(id, { ...formFields, categories: serializedSelectedCats, lang: language, questions }))
          .then(result => {
            if (result) {
              history.push(ROUTES.SERVICE_SETUP_QUESTIONNAIRE);
            }
            setIsLoading(false);
          });
      } else {
        dispatch(createQuestionnaire({ ...formFields, categories: serializedSelectedCats, lang: language, questions }))
          .then(result => {
            if (result) {
              history.push(ROUTES.SERVICE_SETUP_QUESTIONNAIRE);
            }
            setIsLoading(false);
          });
      }
    }
  };

  const handleSetSelectedCategories = (parent, checked) => {
    setSelectedCategories({ ...selectedCategories, [parent]: checked.map(item => parseInt(item)) });
  };

  const enableButtons = () => {
    const languageObj = languages.find(item => item.id === parseInt(language, 10));
    return languageObj && languageObj.code === languageObj.fallback && !isTranslating;
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { title: '', type: 'checkbox', answers: [{ description: '' }, { description: '' }], file: null }]);
    setTimeout(() => {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
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
      if (isUsed) {
        handleShowConfirm();
      } else {
        handleSave();
      }
    }
  };

  const handleNewQuestion = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  const handleClose = () => {
    setShowConfirm(false);
  };

  const handleConfirm = () => {
    handleSave();
    setShowConfirm(false);
  };

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  const enableRejectApprove = () => {
    return !(language.code !== 'en' && _.isEmpty(editTranslations));
  };

  const handleReject = () => {
    if (isTranslating && !_.isEmpty(editTranslation)) {
      setIsLoading(true);
      dispatch(rejectTranslation(editTranslation.id)).then(result => {
        if (result) {
          dispatch(getQuestionnaire(id, language));
        }
        setIsLoading(false);
      });
    }
  };

  const handleApprove = () => {
    let canSave = true;
    const errorQuestionTitle = [];
    const errorAnswerField = [];
    const errorAnswerValue = [];
    const errorAnswerThreshold = [];

    if (formFields.title === '') {
      canSave = false;
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].title === '') {
        canSave = false;
        errorQuestionTitle.push(true);
      } else {
        errorQuestionTitle.push(false);
      }
    }

    for (let i = 0; i < questions.length; i++) {
      errorAnswerField.push([]);
      errorAnswerValue.push([]);
      errorAnswerThreshold.push([]);
      for (let j = 0; j < questions[i].answers.length; j++) {
        if (questions[i].type !== 'open-number' && questions[i].answers[j].description === '') {
          canSave = false;
          errorAnswerField[i].push(true);
        } else {
          errorAnswerField[i].push(false);
        }

        if (questions[i].mark_as_countable && questions[i].answers[j].value === '') {
          canSave = false;
          errorAnswerValue[i].push(true);
        } else {
          errorAnswerValue[i].push(false);
        }

        if (questions[i].mark_as_countable && questions[i].answers[j].threshold === '') {
          canSave = false;
          errorAnswerThreshold[i].push(true);
        } else {
          errorAnswerThreshold[i].push(false);
        }
      }
    }
    setQuestionTitleError(errorQuestionTitle);
    setAnswerFieldError(errorAnswerField);
    setAnswerValueError(errorAnswerValue);
    setAnswerThresholdError(errorAnswerThreshold);

    if (canSave) {
      setIsLoading(true);
      const payload = {
        ...formFields,
        lang: language,
        questions
      };

      dispatch(approveTranslation(editTranslation.id, payload)).then(result => {
        if (result) {
          setIsLoading(false);
          dispatch(getQuestionnaire(id, language));
        }
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{ id ? translate('questionnaire.edit') : translate('questionnaire.create')}</h1>
      </div>
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Row>
          <Col sm={6} xl={6}>
            <Form.Group controlId="formTitle">
              <Form.Label>{translate('questionnaire.title')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              {showFallbackText && questionnaire.fallback &&
                  <FallbackText translate={translate} text={questionnaire.fallback.title} />
              }
              <Form.Control
                name="title"
                onChange={handleChange}
                value={formFields.title}
                placeholder={translate('questionnaire.title.placeholder')}
                isInvalid={titleError}
                maxLength={255}
                aria-label="Title"
              />
              <Form.Control.Feedback type="invalid">
                {translate('questionnaire.title.required')}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6} xl={5}>
            <Form.Group controlId="formLanguage">
              <Form.Label>{translate('common.show_language.version')}</Form.Label>
              {!isTranslating ? (
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
              ) : (
                <SelectLanguage
                  translate={translate}
                  resource={questionnaire}
                  setLanguage={setLanguage}
                  language={language ? language.toString() : null}
                  setEditTranslationIndex={setEditTranslationIndex}
                  setEditTranslations={setEditTranslations}
                  isDisabled={!id}
                />
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={12} xl={11}>
            <Form.Group controlId={'formDescription'}>
              <Form.Label>{translate('questionnaire.description')}</Form.Label>
              {showFallbackText && questionnaire.fallback &&
                  <FallbackText translate={translate} text={questionnaire.fallback.description} />
              }
              <Form.Control
                name="description"
                as="textarea" rows={3}
                placeholder={translate('questionnaire.description.placeholder')}
                value={formFields.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={12} xl={11}>
            <Accordion className="mb-3" defaultActiveKey={1}>
              {
                categoryTreeData.map((category, index) => (
                  <Card key={index}>
                    <Accordion.Toggle eventKey={(index + 1).toString()} className="d-flex align-items-center card-header border-0" onKeyPress={(event) => event.key === 'Enter' && event.stopPropagation()} disabled={isTranslating}>
                      {category.label}
                      <div className="ml-auto">
                        <span className="mr-3">
                          {selectedCategories[category.value] ? selectedCategories[category.value].length : 0} {translate('category.selected')}
                        </span>
                        <ContextAwareToggle eventKey={(index + 1).toString()} />
                      </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={!isTranslating ? (index + 1).toString() : ''}>
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
          </Col>
        </Row>
        <Row>
          <Col sm={3} xs={3}>
            <Form.Group controlId="formIncludeAtTheStart">
              <Form.Check
                name="include_at_the_start"
                onChange={handleCheck}
                value={true}
                checked={formFields.include_at_the_start}
                label={translate('questionnaire.include_at_the_start')}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={3} xs={3}>
            <Form.Group controlId="formIncludeAtTheEnd">
              <Form.Check
                name="include_at_the_end"
                onChange={handleCheck}
                value={true}
                checked={formFields.include_at_the_end}
                label={translate('questionnaire.include_at_the_end')}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={12} xl={11} className="question-wrapper">
            <Question
              questions={questions}
              setQuestions={setQuestions}
              language={language}
              questionTitleError={questionTitleError}
              answerFieldError={answerFieldError}
              answerValueError={answerValueError}
              answerThresholdError={answerThresholdError}
              modifiable={!questionnaire.is_used || !id}
              questionnaire={questionnaire}
              showFallbackText={showFallbackText}
            />
            {enableButtons() &&
              <div className="sticky-btn d-flex justify-content-between">
                <div className="py-1 px-1">
                  <Button
                    aria-label="Add question"
                    variant="link btn-lg"
                    onClick={handleAddQuestion}
                    className="py-1"
                    onKeyPress={(e) => handleNewQuestion(e)}
                  >
                    <BsPlusCircle size={20} /> {translate('questionnaire.new.question')}
                  </Button>
                </div>
                <div className="d-flex align-items-center py-2 px-3 questionnaire-save-cancel-wrapper">
                  {keycloak.hasRealmRole(USER_ROLES.SUPER_ADMIN) &&
                    <>
                      <Form.Group controlId="shareWithPhcWorker" className="mb-0 mr-4">
                        <Form.Check
                          name="share_with_phc_worker"
                          label={translate('common.share_with_phc_worker')}
                          checked={formFields.share_with_phc_worker}
                          onChange={handleCheck}
                          disabled={isTranslating}
                        />
                      </Form.Group>
                      <Form.Group controlId="shareToHiLibrary" className="mb-0 mr-4">
                        <Form.Check
                          name="share_to_hi_library"
                          label={translate('common.share_to_hi_library')}
                          value={true}
                          checked={formFields.share_to_hi_library}
                          onChange={handleCheck}
                          disabled={isTranslating}
                        />
                      </Form.Group>
                    </>
                  }
                  <Button
                    aria-label="Save"
                    onClick={isUsed ? handleShowConfirm : handleSave}
                    disabled={isLoading}
                  >
                    {translate('common.save')}
                  </Button>
                  <Button
                    aria-label="Cancel"
                    className="ml-2"
                    variant="outline-dark"
                    as={Link}
                    to={ROUTES.SERVICE_SETUP_QUESTIONNAIRE}
                    disabled={isLoading}
                  >
                    {translate('common.cancel')}
                  </Button>
                </div>
              </div>
            }
            {!enableButtons() &&
              <div className="sticky-btn d-flex justify-content-end">
                <div className="py-2 questionnaire-save-cancel-wrapper px-3">
                  {enableRejectApprove() &&
                    <>
                      <Button
                        onClick={handleApprove}
                        disabled={isLoading}
                      >
                        {translate('common.approve')}
                      </Button>
                      <Button
                        onClick={handleReject}
                        className="ml-2"
                        variant="outline-primary"
                        disabled={isLoading}
                      >
                        {translate('common.reject')}
                      </Button>
                    </>
                  }
                  {!enableRejectApprove() &&
                    <Button
                      aria-label="Save"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {translate('common.save')}
                    </Button>
                  }
                  <Button
                    aria-label="Cancel"
                    className="ml-2"
                    variant="outline-dark"
                    as={Link}
                    to={ROUTES.SERVICE_SETUP_QUESTIONNAIRE}
                    disabled={isLoading}
                  >
                    {translate('common.cancel')}
                  </Button>
                </div>
              </div>
            }
          </Col>
        </Row>
      </Form>
      <Dialog
        show={showConfirm}
        title={translate('questionnaire.update_used_questionnaire_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirm}
      >
        <p>{translate('questionnaire.update_used_questionnaire_confirmation_message')}</p>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

CreateQuestionnaire.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(CreateQuestionnaire);

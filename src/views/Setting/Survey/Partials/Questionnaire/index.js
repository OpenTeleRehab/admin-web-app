import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Button, Col, Form, Row, Accordion, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getQuestionnaire
} from '../../../../../store/questionnaire/actions';
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
import scssColors from '../../../../../scss/custom.scss';
import Select from 'react-select';
import { USER_ROLES } from '../../../../../variables/user';
import SelectLanguage from '../../../../ServiceSetup/_Partials/SelectLanguage';
import FallbackText from '../../../../../components/Form/FallbackText';

const Questionnaire = ({ translate, titleError, questionTitleError, answerFieldError, id, questionnaireData, setQuestionnaireData, language, setLanguage }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const isTranslating = keycloak.hasRealmRole(USER_ROLES.TRANSLATE_EXERCISE);

  const { languages } = useSelector(state => state.language);
  const { questionnaire } = useSelector(state => state.questionnaire);
  const { categoryTreeData } = useSelector((state) => state.category);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const [questions, setQuestions] = useState([{ title: '', type: 'checkbox', answers: [{ description: '' }, { description: '' }], file: null }]);
  const [editTranslations, setEditTranslations] = useState([]);
  const [editTranslationIndex, setEditTranslationIndex] = useState(1);
  const [editTranslation, setEditTranslation] = useState(null);
  const [showFallbackText, setShowFallbackText] = useState(false);

  useEffect(() => {
    if (languages.length) {
      setLanguage(languages[0].id);
    }
  }, [languages]);

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
        setQuestionnaireData({
          title: questionnaire.title,
          description: questionnaire.description
        });
        setQuestions(questionnaire.questions);
        setShowFallbackText(false);
      } else {
        setQuestionnaireData({
          title: editTranslation.title,
          description: editTranslation.description
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
    if (questions) {
      setQuestionnaireData(prev => ({
        ...prev,
        questions: questions
      }));
    }
  }, [questions]);

  useEffect(() => {
    if (selectedCategories) {
      let serializedSelectedCats = [];
      Object.keys(selectedCategories).forEach(function (key) {
        serializedSelectedCats = _.union(serializedSelectedCats, selectedCategories[key]);
      });
      setQuestionnaireData(prev => ({
        ...prev,
        categories: serializedSelectedCats
      }));
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (!_.isEmpty(editTranslations)) {
      setEditTranslation(editTranslations[editTranslationIndex - 1]);
    } else {
      setEditTranslation(null);
    }
    // eslint-disable-next-line
  }, [editTranslations, editTranslationIndex]);

  const handleChange = e => {
    const { name, value } = e.target;
    setQuestionnaireData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleNewQuestion = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
          <h1>{ translate('survey.questionnaire')}</h1>
        </div>
      </Card.Header>
      <Card.Body>
        {/* <Form onKeyPress={(e) => handleFormSubmit(e)}> */}
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
                value={questionnaireData.title}
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
                value={questionnaireData.description}
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
          <Col sm={12} xl={11} className="question-wrapper">
            <Question
              questions={questions}
              setQuestions={setQuestions}
              language={language}
              questionTitleError={questionTitleError}
              answerFieldError={answerFieldError}
              modifiable={!questionnaire.is_used || !id}
              questionnaire={questionnaire}
              showFallbackText={showFallbackText}
            />
            {enableButtons() &&
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
            }
          </Col>
        </Row>
        {/* </Form> */}
      </Card.Body>
    </Card>
  );
};

Questionnaire.propTypes = {
  translate: PropTypes.func,
  titleError: PropTypes.bool,
  questionTitleError: PropTypes.array,
  answerFieldError: PropTypes.array,
  setQuestionnaireData: PropTypes.func,
  questionnaireData: PropTypes.object,
  id: PropTypes.number,
  language: PropTypes.string,
  setLanguage: PropTypes.func
};

export default withLocalize(Questionnaire);

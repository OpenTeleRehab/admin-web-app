import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Button, Col, Form, Row, Accordion, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as ROUTES from '../../../variables/routes';
import {
  createQuestionnaire,
  getQuestionnaire,
  updateQuestionnaire
} from '../../../store/questionnaire/actions';
import Question from './Question/question';
import { getCategoryTreeData } from 'store/category/actions';
import { CATEGORY_TYPES } from 'variables/category';
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

const CreateQuestionnaire = ({ translate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const { languages } = useSelector(state => state.language);
  const { questionnaire, filters } = useSelector(state => state.questionnaire);
  const { categoryTreeData } = useSelector((state) => state.category);
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
      setFormFields({
        title: questionnaire.title,
        description: questionnaire.description
      });
      setQuestions(questionnaire.questions);
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
  }, [id, questionnaire, categoryTreeData]);

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSave = () => {
    let canSave = true;
    const errorQuestionTitle = [];
    const errorAnswerField = [];

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
      for (let j = 0; j < questions[i].answers.length; j++) {
        if (questions[i].answers[j].description === '') {
          canSave = false;
          errorAnswerField[i].push(true);
        } else {
          errorAnswerField[i].push(false);
        }
      }
    }
    setQuestionTitleError(errorQuestionTitle);
    setAnswerFieldError(errorAnswerField);

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
    return languageObj && languageObj.code === languageObj.fallback && (!questionnaire.is_used || !id);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { title: '', type: 'checkbox', answers: [{ description: '' }, { description: '' }], file: null }]);
    setTimeout(() => {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <h1>{ id ? translate('questionnaire.edit') : translate('questionnaire.create')}</h1>
      </div>
      <Form onSubmit={handleSave}>
        <Row>
          <Col sm={6} xl={6}>
            <Form.Group controlId="formTitle">
              <Form.Label>{translate('questionnaire.title')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                name="title"
                onChange={handleChange}
                value={formFields.title}
                placeholder={translate('questionnaire.title.placeholder')}
                isInvalid={titleError}
                maxLength={255}
              />
              <Form.Control.Feedback type="invalid">
                {translate('questionnaire.title.required')}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6} xl={5}>
            <Form.Group controlId="formLanguage">
              <Form.Label>{translate('common.show_language.version')}</Form.Label>
              <Form.Control as="select" value={language} onChange={handleLanguageChange} disabled={!id}>
                {languages.map((language, index) => (
                  <option key={index} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={12} xl={11}>
            <Form.Group controlId={'formDescription'}>
              <Form.Label>{translate('questionnaire.description')}</Form.Label>
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
            />
            <div className="questionnaire-sticky-btn d-flex justify-content-between">
              {enableButtons() &&
                <div className="py-1 px-1">
                  <Button
                    variant="link btn-lg"
                    onClick={handleAddQuestion}
                    className="py-1"
                  >
                    <BsPlusCircle size={20} /> {translate('questionnaire.new.question')}
                  </Button>
                </div>
              }
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
                  to={ROUTES.SERVICE_SETUP_QUESTIONNAIRE}
                  disabled={isLoading}
                >
                  {translate('common.cancel')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

CreateQuestionnaire.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(CreateQuestionnaire);

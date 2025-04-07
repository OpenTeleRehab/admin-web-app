import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Button, Col, Form, Row, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getQuestionnaire
} from '../../../../../store/questionnaire/actions';
import Question from './Question/question';
import { useKeycloak } from '@react-keycloak/web';
import {
  BsPlusCircle
} from 'react-icons/bs';
import scssColors from '../../../../../scss/custom.scss';
import Select from 'react-select';
import { USER_ROLES } from '../../../../../variables/user';
import SelectLanguage from '../../../../ServiceSetup/_Partials/SelectLanguage';
import FallbackText from '../../../../../components/Form/FallbackText';
import _ from 'lodash';

const Questionnaire = ({ translate, titleError, questionTitleError, answerFieldError, id, questionnaireData, setQuestionnaireData, language, setLanguage, answerValueError, answerThresholdError }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const isTranslating = keycloak.hasRealmRole(USER_ROLES.TRANSLATE_EXERCISE);

  const { languages } = useSelector(state => state.language);
  const { questionnaire } = useSelector(state => state.questionnaire);

  const [questions, setQuestions] = useState([{ title: '', type: 'checkbox', answers: [{ description: '', value: '', threshold: '' }, { description: '', value: '', threshold: '' }], file: null, mandatory: false }]);
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
    if (id && language) {
      dispatch(getQuestionnaire(id, language));
    }
  }, [id, language, dispatch]);

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
    }
  }, [id, questionnaire, editTranslation]);

  useEffect(() => {
    if (questions) {
      setQuestionnaireData(prev => ({
        ...prev,
        questions: questions
      }));
    }
  }, [questions]);

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

  const enableButtons = () => {
    const languageObj = languages.find(item => item.id === parseInt(language, 10));
    return languageObj && languageObj.code === languageObj.fallback && !isTranslating;
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { title: '', type: 'checkbox', answers: [{ description: '', value: '', threshold: '' }, { description: '', value: '', threshold: '' }], file: null, mandatory: false }]);
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
          <Col sm={6} xl={6}>
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
          <Col sm={12} xl={12}>
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
          <Col sm={12} xl={12} className="question-wrapper">
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
  setLanguage: PropTypes.func,
  answerValueError: PropTypes.array,
  answerThresholdError: PropTypes.array
};

export default withLocalize(Questionnaire);

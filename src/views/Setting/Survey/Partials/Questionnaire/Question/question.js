import React from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  Col,
  Form,
  Row
} from 'react-bootstrap';
import { BsPlus, BsUpload, BsX, BsArrowsMove } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { FaCopy, FaTrashAlt } from 'react-icons/fa';
import settings from '../../../../../../settings';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import keycloak from '../../../../../../utils/keycloak';
import { USER_ROLES } from '../../../../../../variables/user';
import FallbackText from '../../../../../../components/Form/FallbackText';

const reorderQuestion = (questions, startIndex, endIndex) => {
  const result = Array.from(questions);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Question = ({ translate, questions, setQuestions, language, questionTitleError, answerFieldError, questionnaire, showFallbackText, modifiable, answerValueError, answerThresholdError }) => {
  const { languages } = useSelector(state => state.language);
  const isTranslating = keycloak.hasRealmRole(USER_ROLES.TRANSLATE_EXERCISE);
  const handleFileChange = (e, index) => {
    const { name, files } = e.target;
    const values = [...questions];
    values[index][name] = files[0];
    setQuestions(values);
  };

  const readImage = (file) => {
    if (file) {
      if (file.id) {
        return `${process.env.REACT_APP_API_BASE_URL}/file/${file.id}`;
      }

      return window.URL.createObjectURL(file);
    }

    return '';
  };

  const handleFileRemove = (index) => {
    const values = [...questions];
    values[index].file = null;
    setQuestions(values);
  };

  const handleAddAnswer = (index) => {
    const newAnswer = questions[index].answers;
    newAnswer.push({ description: '', value: '', threshold: '' });
    const questionData = [...questions];
    questionData[index] = { ...questionData[index], answers: newAnswer };
    setQuestions(questionData);
  };

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const answers = questions[questionIndex].answers;
    answers[answerIndex][e.target.name] = e.target.value;
    const questionData = [...questions];
    questionData[questionIndex] = { ...questionData[questionIndex], answers: answers };
    setQuestions(questionData);
  };

  const handleAnswerRemove = (questionIndex, answerIndex) => {
    const answers = questions[questionIndex].answers;
    if (answerIndex !== -1) {
      answers.splice(answerIndex, 1);
    }
    const questionData = [...questions];
    questionData[questionIndex] = { ...questionData[questionIndex], answer: answers };
    setQuestions(questionData);
  };

  const handleQuestionTitleChange = (index, e) => {
    const values = [...questions];
    values[index][e.target.name] = e.target.value;
    setQuestions(values);
  };

  const handleSelectChange = (index, e) => {
    const values = [...questions];
    values[index].type = e.target.value;
    values[index] = { ...values[index], answers: values[index].type === 'checkbox' || values[index].type === 'multiple' ? [{ description: '', value: '', threshold: '' }, { description: '', value: '', threshold: '' }] : values[index].type === 'open-number' ? [{ value: '', threshold: '' }] : [] };
    setQuestions(values);
  };

  const handleRemoveQuestion = (index) => {
    questions.splice(index, 1);
    setQuestions([...questions]);
  };

  const enableButtons = (question, isEnabled) => {
    const languageObj = languages.find(item => item.id === parseInt(language, 10));
    return languageObj && languageObj.code === languageObj.fallback && (modifiable || !question.id || isEnabled) && !isTranslating;
  };

  const handleCloneQuestion = (index) => {
    const { title, type } = questions[index];
    const answers = _.cloneDeep(questions[index].answers);
    setQuestions([...questions, { title, type, answers }]);
    setTimeout(() => {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
  };

  const onDragEnd = (e) => {
    // dropped outside the list
    if (!e.destination) {
      return;
    }

    const updatedQuestions = reorderQuestion(
      questions,
      e.source.index,
      e.destination.index
    );

    setQuestions(updatedQuestions);
  };

  const handleFileUpload = (e, index) => {
    if (e.key === 'Enter') {
      document.getElementById('file' + index).click();
      e.stopPropagation();
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  const disabledEditAnswerValueThreshold = () => {
    const languageObj = languages.find(item => item.id === parseInt(language, 10));
    return languageObj && languageObj.code !== languageObj.fallback;
  };

  return (
    <>
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {questions.map((question, index) => (
                <Draggable key={index} draggableId={`question${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Card className="question-card mb-3">
                        <Card.Header className="card-header">
                          <Card.Title className="d-flex justify-content-between">
                            <h5>{translate('questionnaire.question_number', { number: index + 1 })}</h5>
                            <>
                              {enableButtons(question, true) &&
                                <div
                                  {...provided.dragHandleProps}
                                >
                                  <Button
                                    aria-label="Move question"
                                    variant="link"
                                    size="sm"
                                    className="text-dark p-0 mr-5 mb-3 drag-button justify-center"
                                  >
                                    <BsArrowsMove size={20}/>
                                  </Button>
                                </div>
                              }
                              <div>
                                {enableButtons(question) &&
                                  <>
                                    <Button
                                      aria-label="Clone question"
                                      variant="link"
                                      size="sm"
                                      className="text-primary p-0 mr-1"
                                      onClick={() => handleCloneQuestion(index)}
                                    >
                                      <FaCopy size={20}/>
                                    </Button>
                                    <Button
                                      aria-label="remove question"
                                      variant="link"
                                      size="sm"
                                      className="text-danger p-0"
                                      onClick={() => handleRemoveQuestion(
                                        index)}
                                      disabled={questions.length === 1}
                                    >
                                      <FaTrashAlt size={20}/>
                                    </Button>
                                  </>
                                }
                              </div>
                            </>
                          </Card.Title>
                          <Row>
                            <Col sm={8} xl={7}>
                              <Form.Group controlId={`formTitle${index}`}>
                                {showFallbackText && question.fallback &&
                                    <FallbackText translate={translate} text={questionnaire.questions[index].fallback.title} />
                                }
                                <Form.Control
                                  name="title"
                                  onChange={e => handleQuestionTitleChange(index, e)}
                                  value={question.title}
                                  placeholder={translate('questionnaire.title.placeholder')}
                                  isInvalid={questionTitleError[index]}
                                  maxLength={settings.textMaxLength}
                                  aria-label="Title"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {translate('question.title.required')}
                                </Form.Control.Feedback>
                              </Form.Group>
                              { question.file &&
                                <div className="mb-2 w-50 d-flex justify-content-between">
                                  <img src={readImage(question.file)} alt="..." className="img-thumbnail"/>
                                  {enableButtons(question) &&
                                    <div className="ml-3">
                                      <Button
                                        aria-label="remove file"
                                        variant="outline-danger"
                                        className="remove-btn"
                                        onClick={() => handleFileRemove(index)}
                                        onKeyPress={(e) => handleEnterKeyPress(e)}
                                      >
                                        <BsX size={15} />
                                      </Button>
                                    </div>
                                  }
                                </div>
                              }
                              {enableButtons(question) &&
                                <div className="btn btn-sm text-primary position-relative overflow-hidden" tabIndex="0" role="button" onKeyPress={(event) => handleFileUpload(event, index)}>
                                  <BsUpload size={15}/> {translate('question.media_upload')}
                                  <input
                                    type="file"
                                    id={`file${index}`}
                                    name="file"
                                    className="position-absolute upload-btn"
                                    onChange={e => handleFileChange(e, index)}
                                    accept={settings.question.acceptImageTypes}
                                    aria-label="Upload"/>
                                </div>
                              }
                            </Col>
                            <Col sm={5} xl={4}>
                              <Form.Group controlId={`formType${index}`}>
                                <Form.Control name ="type" as="select" value={question.type} onChange={e => handleSelectChange(index, e)} disabled={!enableButtons(question)}>
                                  <option value='checkbox'>{translate('question.type.checkbox')}</option>
                                  <option value='multiple'>{translate('question.type.multiple_choice')}</option>
                                  <option value='open-text'>{translate('question.type.open_ended_free_text')}</option>
                                  <option value='open-number'>{translate('question.type.open_ended_numbers_only')}</option>
                                </Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-3">
                            {
                              question.type === 'checkbox' && (
                                question.answers.map((answer, answerIndex) => (
                                  <Row key={answerIndex}>
                                    <Col sm={4} xs={4}>
                                      <Form.Check type='checkbox'>
                                        {showFallbackText && answer.fallback &&
                                            <FallbackText translate={translate} text={questionnaire.questions[index].answers[answerIndex].fallback.description} />
                                        }
                                        <Form.Check.Input type='checkbox' isValid className="mt-3" disabled aria-label="checkbox" />
                                        <Form.Check.Label className="w-100">
                                          <Form.Group controlId={`formValue${answerIndex}`}>
                                            <Form.Control
                                              name="description"
                                              value={answer.description}
                                              placeholder={translate('question.answer.description.placeholder')}
                                              onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                                              isInvalid={answerFieldError[index] ? answerFieldError[index][answerIndex] : false}
                                              aria-label="Value"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {translate('question.answer.description.required')}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Form.Check.Label>
                                      </Form.Check>
                                    </Col>
                                    <Col sm={3} xs={3}>
                                      <Form.Group controlId={`formAnswerValue${answerIndex}`}>
                                        <Form.Control
                                          type="number"
                                          name="value"
                                          value={answer.value}
                                          placeholder={translate('question.answer_value')}
                                          onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                                          isInvalid={answerValueError[index] ? answerValueError[index][answerIndex] : false}
                                          aria-label="answer value"
                                          disabled={disabledEditAnswerValueThreshold()}
                                          min={0}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {translate('question.answer.value.required')}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col sm={3} xs={3}>
                                      <Form.Group controlId={`formAnswerThreshold${answerIndex}`}>
                                        <Form.Control
                                          type="number"
                                          name="threshold"
                                          value={answer.threshold}
                                          placeholder={translate('question.answer_threshold')}
                                          onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                                          isInvalid={answerThresholdError[index] ? answerThresholdError[index][answerIndex] : false}
                                          aria-label="answer threshold"
                                          disabled={disabledEditAnswerValueThreshold()}
                                          min={0}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {translate('question.answer.threshold.required')}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    {enableButtons(question, !answer.id) &&
                                      <Col sm={2} xl={2} className="mt-1">
                                        <Button
                                          aria-label="remove answer"
                                          variant="outline-danger"
                                          className="remove-btn"
                                          onClick={() => handleAnswerRemove(index, answerIndex)}
                                          disabled={question.answers.length <= 2}
                                          onKeyPress={(e) => handleEnterKeyPress(e)}
                                        >
                                          <BsX size={15} />
                                        </Button>
                                      </Col>
                                    }
                                  </Row>
                                ))
                              )
                            }
                            {
                              question.type === 'multiple' && (
                                question.answers.map((answer, answerIndex) => (
                                  <Row key={answerIndex}>
                                    <Col sm={4} xl={4}>
                                      <Form.Check type='radio'>
                                        {showFallbackText && answer.fallback &&
                                            <FallbackText translate={translate} text={questionnaire.questions[index].answers[answerIndex].fallback.description} />
                                        }
                                        <Form.Check.Input type='radio' isValid className="mt-3" disabled aria-label="radio button"/>
                                        <Form.Check.Label className="w-100">
                                          <Form.Group controlId={`formValue${answerIndex}`}>
                                            <Form.Control
                                              name="description"
                                              value={answer.description}
                                              placeholder={translate('question.answer.description.placeholder')}
                                              onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                                              isInvalid={answerFieldError[index] ? answerFieldError[index][answerIndex] : false}
                                              aria-label="Value"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {translate('question.answer.description.required')}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                        </Form.Check.Label>
                                      </Form.Check>
                                    </Col>
                                    <Col sm={3} xs={3}>
                                      <Form.Group controlId={`formAnswerValue${answerIndex}`}>
                                        <Form.Control
                                          type="number"
                                          name="value"
                                          value={answer.value}
                                          placeholder={translate('question.answer_value')}
                                          onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                                          isInvalid={answerValueError[index] ? answerValueError[index][answerIndex] : false}
                                          aria-label="answer value"
                                          disabled={disabledEditAnswerValueThreshold()}
                                          min={0}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {translate('question.answer.value.required')}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    <Col sm={3} xs={3}>
                                      <Form.Group controlId={`formAnswerThreshold${answerIndex}`}>
                                        <Form.Control
                                          type="number"
                                          name="threshold"
                                          value={answer.threshold}
                                          placeholder={translate('question.answer_threshold')}
                                          onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                                          isInvalid={answerThresholdError[index] ? answerThresholdError[index][answerIndex] : false}
                                          aria-label="answer threshold"
                                          disabled={disabledEditAnswerValueThreshold()}
                                          min={0}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {translate('question.answer.threshold.required')}
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                    {enableButtons(question, !answer.id) &&
                                      <Col sm={2} xl={2} className="mt-1">
                                        <Button
                                          variant="outline-danger"
                                          className="remove-btn"
                                          onClick={() => handleAnswerRemove(index, answerIndex)}
                                          disabled={question.answers.length <= 2}
                                          onKeyPress={(e) => handleEnterKeyPress(e)}
                                        >
                                          <BsX size={15} />
                                        </Button>
                                      </Col>
                                    }
                                  </Row>
                                ))
                              )
                            }
                            {
                              question.type === 'open-text' && (
                                <Form.Group controlId='formValue'>
                                  <Form.Control
                                    disabled
                                    name="description"
                                    aria-label="Open text"
                                  />
                                </Form.Group>
                              )
                            }
                            {
                              question.type === 'open-number' && (
                                <Row>
                                  <Col sm={4} xs={4}>
                                    <Form.Group controlId='formValue'>
                                      <Form.Control
                                        disabled
                                        type="number"
                                        name="description"
                                        aria-label="Open number"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col sm={3} xs={3}>
                                    <Form.Group controlId={'formAnswerValue'}>
                                      <Form.Control
                                        type="number"
                                        name="value"
                                        value={question.answers[0] ? question.answers[0].value : ''}
                                        placeholder={translate('question.answer_value')}
                                        onChange={(e) => handleAnswerChange(index, 0, e)}
                                        isInvalid={answerThresholdError[index] ? answerThresholdError[index][0] : false}
                                        aria-label="answer value"
                                        disabled={disabledEditAnswerValueThreshold()}
                                        min={0}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {translate('question.answer.value.required')}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col sm={3} xs={3}>
                                    <Form.Group controlId={'formAnswerThreshold'}>
                                      <Form.Control
                                        type="number"
                                        name="threshold"
                                        value={question.answers[0] ? question.answers[0].threshold : ''}
                                        placeholder={translate('question.answer_threshold')}
                                        onChange={(e) => handleAnswerChange(index, 0, e)}
                                        isInvalid={answerThresholdError[index] ? answerThresholdError[index][0] : false}
                                        aria-label="answer threshold"
                                        disabled={disabledEditAnswerValueThreshold()}
                                        min={0}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {translate('question.answer.threshold.required')}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              )
                            }
                            {
                              (enableButtons(question, true) && (question.type === 'checkbox' || question.type === 'multiple')) &&
                                <Form.Group className="ml-3">
                                  <Button
                                    variant="link"
                                    onClick={() => handleAddAnswer(index)}
                                    className="p-0"
                                    onKeyPress={(event) => handleEnterKeyPress(event)}
                                  >
                                    <BsPlus size={15} /> {translate('question.add.more.answer')}
                                  </Button>
                                </Form.Group>
                            }
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

Question.propTypes = {
  translate: PropTypes.func,
  questions: PropTypes.array,
  setQuestions: PropTypes.func,
  language: PropTypes.string,
  questionTitleError: PropTypes.array,
  answerFieldError: PropTypes.array,
  modifiable: PropTypes.bool,
  questionnaire: PropTypes.object,
  showFallbackText: PropTypes.bool,
  answerValueError: PropTypes.array,
  answerThresholdError: PropTypes.array
};

export default withLocalize(Question);

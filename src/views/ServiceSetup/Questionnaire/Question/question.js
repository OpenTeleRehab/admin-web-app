import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import {
  Button,
  Card,
  Col,
  Form,
  Row
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../../variables/routes';
import { BsPlus, BsUpload, BsX } from 'react-icons/bs';

const Question = ({ translate, questions, setQuestions }) => {
  const [imageUpload, setImageUpload] = useState(null);

  const handleSave = () => {
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      setImageUpload(reader.result);
    };
  };

  const handleFileRemove = () => {
    setImageUpload(null);
  };

  const handleAddAnswer = (index) => {
    const newAnswer = questions[index].answers;
    newAnswer.push({ description: '' });
    const questionData = [...questions];
    const updatedQuestion = { ...questionData[index], answers: newAnswer };
    questionData[index] = updatedQuestion;
    setQuestions(questionData);
  };

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const answers = questions[questionIndex].answers;
    answers[answerIndex].description = e.target.value;
    const questionData = [...questions];
    const updatedQuestion = { ...questionData[questionIndex], answer: answers };
    questionData[questionIndex] = updatedQuestion;
    setQuestions(questionData);
  };

  const handleAnswerRemove = (questionIndex, answerIndex) => {
    const answers = questions[questionIndex].answers;
    if (answerIndex !== -1) {
      answers.splice(answerIndex, 1);
    }
    const questionData = [...questions];
    const updatedQuestion = { ...questionData[questionIndex], answer: answers };
    questionData[questionIndex] = updatedQuestion;
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
    const updatedQuestion = { ...values[index], answers: values[index].type === 'checkbox' || values[index].type === 'multiple choice' ? [{ description: '' }] : [] };
    values[index] = updatedQuestion;
    setQuestions(values);
  };

  return (
    <>
      {
        questions.map((question, index) => (
          <Card key={index} className="question-card">
            <Card.Header className="card-header">
              <Card.Title>Question {index + 1}</Card.Title>
              <Row>
                <Col sm={8} xl={7}>
                  <Form.Group controlId={`formTitle${index}`}>
                    <Form.Control
                      name="title"
                      onChange={e => handleQuestionTitleChange(index, e)}
                      value={question.title}
                      placeholder={translate('questionnaire.title.placeholder')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {translate('question.title.required')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  { imageUpload &&
                    <div className="mb-2 position-relative w-50">
                      <div className="position-absolute remove-btn-wrapper">
                        <Button
                          variant="outline-danger"
                          className="remove-btn"
                          onClick={handleFileRemove}
                        >
                          <BsX size={15} />
                        </Button>
                      </div>
                      <img src={imageUpload} alt="..." className="img-thumbnail"/>
                    </div>
                  }
                  <div className="btn btn-sm text-primary position-relative overflow-hidden" >
                    <BsUpload size={15}/> Upload Image
                    <input type="file" name="file" className="position-absolute upload-btn" onChange={handleFileChange} accept=".jpeg, .png"/>
                  </div>
                </Col>
                <Col sm={5} xl={4}>
                  <Form.Group controlId={`formType${index}`}>
                    <Form.Control name ="type" as="select" value={question.type} onChange={e => handleSelectChange(index, e)}>
                      <option value='checkbox'>{translate('question.type.checkbox')}</option>
                      <option value='multiple choice'>{translate('question.type.multiple_choice')}</option>
                      <option value='open-ended text'>{translate('question.type.open_ended_free_text')}</option>
                      <option value='open-ended number'>{translate('question.type.open_ended_numbers_only')}</option>
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
                      <Form.Check key={answerIndex} type='checkbox'>
                        <Form.Check.Input type='checkbox' isValid className="mt-3" disabled />
                        <Form.Check.Label className="w-50 mr-3">
                          <Form.Group controlId={`formValue${answerIndex}`}>
                            <Form.Control
                              name="value"
                              value={answer.description}
                              placeholder={translate('answer.input.placeholder')}
                              onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                            />
                            <Form.Control.Feedback type="invalid">
                              {translate('answer.input.required')}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Check.Label>
                        <Button
                          variant="outline-danger"
                          className="remove-btn btn-circle-sm"
                          onClick={() => handleAnswerRemove(index, answerIndex)}
                        >
                          <BsX size={15} />
                        </Button>
                      </Form.Check>
                    ))
                  )
                }
                {
                  question.type === 'multiple choice' && (
                    question.answers.map((answer, answerIndex) => (
                      <Form.Check key={answerIndex} type='radio'>
                        <Form.Check.Input type='radio' isValid className="mt-3" disabled />
                        <Form.Check.Label className="w-50 mr-3">
                          <Form.Group controlId={`formValue${answerIndex}`}>
                            <Form.Control
                              name="value"
                              value={answer.description}
                              placeholder={translate('answer.input.placeholder')}
                              onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                            />
                            <Form.Control.Feedback type="invalid">
                              {translate('answer.input.required')}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Check.Label>
                        <Button
                          variant="outline-danger"
                          className="remove-btn btn-circle-sm"
                          onClick={() => handleAnswerRemove(index, answerIndex)}
                        >
                          <BsX size={15} />
                        </Button>
                      </Form.Check>
                    ))
                  )
                }
                {
                  question.type === 'open-ended text' && (
                    <Form.Group controlId='formValue'>
                      <Form.Control
                        disabled
                        name="value"
                        placeholder={translate('answer.input.placeholder')}
                      />
                      <Form.Control.Feedback type="invalid">
                        {translate('answer.input.required')}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )
                }
                {
                  question.type === 'open-ended number' && (
                    <Form.Group controlId='formValue'>
                      <Form.Control
                        disabled
                        type="number"
                        name="value"
                        placeholder={translate('answer.input.placeholder')}
                      />
                      <Form.Control.Feedback type="invalid">
                        {translate('answer.input.required')}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )
                }
                {
                  (question.type === 'checkbox' || question.type === 'multiple choice') &&
                    <Form.Group className="ml-3">
                      <Button
                        variant="link"
                        onClick={() => handleAddAnswer(index)}
                        className="p-0"
                      >
                        <BsPlus size={15} /> {translate('question.add.more.answer')}
                      </Button>
                    </Form.Group>
                }
              </div>
            </Card.Body>
            <Card.Footer className="text-muted">
              <Form.Group>
                <Button
                  onClick={handleSave}
                >
                  {translate('common.save')}
                </Button>
                <Button
                  className="ml-2"
                  variant="outline-dark"
                  as={Link}
                  to={ROUTES.SERVICE_SETUP_QUESTIONNAIRE}
                >
                  {translate('common.cancel')}
                </Button>
              </Form.Group>
            </Card.Footer>
          </Card>
        ))
      }
    </>
  );
};

Question.propTypes = {
  translate: PropTypes.func,
  questions: PropTypes.array,
  setQuestions: PropTypes.func
};

export default withLocalize(Question);

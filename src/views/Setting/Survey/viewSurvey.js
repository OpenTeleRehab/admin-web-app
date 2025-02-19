import React, { useContext } from 'react';
import Dialog from 'components/Dialog';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { Accordion, AccordionContext, Card, Form } from 'react-bootstrap';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import GoogleTranslationAttribute from '../../../components/GoogleTranslationAttribute';
import moment from 'moment';
import settings from 'settings';

const ViewSurvey = ({ show, handleClose, survey }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <Dialog
      show={show}
      size="lg"
      scrollable={true}
      title={survey.questionnaire.title}
      onCancel={handleClose}
      cancelLabel={translate('common.close')}
    >
      <div className="d-flex flex-column mb-2">
        <span className="font-weight-bold">{translate('questionnaire.description')}</span>
        <span>{survey.questionnaire.description}</span>
      </div>
      <div className="d-flex flex-column mb-3">
        <span className="font-weight-bold">{translate('questionnaire.number_of_question')}</span>
        <span>{survey.questionnaire.questions.length}</span>
      </div>
      {survey.start_date && survey.end_date && (
        <>
          <div className="d-flex flex-column mb-2">
            <span className="font-weight-bold">{translate('survey.start_date')}</span>
            <span>{moment(survey.start_date).format(settings.date_format)}</span>
          </div>
          <div className="d-flex flex-column mb-2">
            <span className="font-weight-bold">{translate('survey.end_date')}</span>
            <span>{moment(survey.end_date).format(settings.date_format)}</span>
          </div>
        </>
      )}

      {Boolean(survey.include_at_the_start) && (
        <div className="d-flex flex-column mb-3">
          <span className="font-weight-bold">{translate('survey.include_at_the_start')}</span>
        </div>
      )}

      {Boolean(survey.include_at_the_end) && (
        <div className="d-flex flex-column mb-3">
          <span className="font-weight-bold">{translate('survey.include_at_the_end')}</span>
        </div>
      )}

      {survey.questionnaire.questions.map((question, index) => (
        <Accordion key={index}>
          <Card className="mb-3 question-card">
            <Accordion.Toggle eventKey={index + 1} className="card-header view-question-card-header d-flex justify-content-between border-0">
              <h6>{translate('questionnaire.question_number', { number: index + 1 })}</h6>
              <ContextAwareToggle eventKey={(index + 1).toString()} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body>
                { question.file &&
                  <img src={`${process.env.REACT_APP_API_BASE_URL}/file/${question.file.id}`} alt="..." className="img-thumbnail"/>
                }
                <div className="mb-2 mt-2">
                  {question.title}
                </div>
                <div>
                  {
                    question.type === 'checkbox' && (
                      question.answers.map((answer, index) => (
                        <div key={index}>
                          <Form.Check
                            aria-label={answer.description}
                            inline label={answer.description}
                            type='checkbox'
                            disabled
                          />
                        </div>
                      ))
                    )
                  }
                  {
                    question.type === 'multiple' && (
                      question.answers.map((answer, index) => (
                        <div key={index}>
                          <Form.Check
                            aria-label={answer.description}
                            inline label={answer.description}
                            type='radio'
                            disabled
                          />
                        </div>
                      ))
                    )
                  }
                  {
                    question.type === 'open-text' && (
                      <div className="ml-1">
                        <Form.Group controlId='formValue'>
                          <Form.Control
                            disabled
                            type="text"
                            aria-label="Text input box"
                          />
                        </Form.Group>
                      </div>
                    )
                  }
                  {
                    question.type === 'open-number' && (
                      <div className="ml-1">
                        <Form.Group controlId='formValue'>
                          <Form.Control
                            disabled
                            type="number"
                            aria-label="Number input box"
                          />
                        </Form.Group>
                      </div>
                    )
                  }
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      ))
      }
      { survey.questionnaire.auto_translated === true && (
        <GoogleTranslationAttribute />
      )}
    </Dialog>
  );
};

ViewSurvey.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  survey: PropTypes.object
};

export default ViewSurvey;

const ContextAwareToggle = ({ eventKey }) => {
  const currentEventKey = useContext(AccordionContext);

  if (currentEventKey === eventKey) {
    return <BsChevronDown className="ml-auto" />;
  }

  return <BsChevronRight className="ml-auto" />;
};

ContextAwareToggle.propTypes = {
  eventKey: PropTypes.string
};

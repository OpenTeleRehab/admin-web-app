import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Accordion, AccordionContext, Card, Form } from 'react-bootstrap';
import { getScreeningQuestionnaire } from '../../../store/screeningQuestionnaire/actions';
import { SCREENING_QUESTION_TYPE } from '../../../variables/questionnaire';
import GoogleTranslationAttribute from '../../../components/GoogleTranslationAttribute';
import Dialog from '../../../components/Dialog';
import Select from 'react-select';
import scssColors from '../../../scss/custom.scss';

const ViewScreeningQuestionnaire = ({ id, show, handleClose }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector(state => state.auth);
  const { screeningQuestionnaire } = useSelector(state => state.screeningQuestionnaire);
  const [language, setLanguage] = useState(profile?.language_id ?? languages?.[0]?.id);

  useEffect(() => {
    if (id) {
      dispatch(getScreeningQuestionnaire(id, language));
    }
  }, [id, language, dispatch]);

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
    <Dialog
      show={show}
      size="lg"
      scrollable={true}
      title={screeningQuestionnaire?.title}
      onCancel={handleClose}
      cancelLabel={translate('common.close')}
    >
      <Form.Group controlId="formLanguage">
        <Form.Label>{translate('common.language')}</Form.Label>
        <Select
          placeholder={translate('placeholder.language')}
          classNamePrefix="filter"
          value={languages.filter(option => option.id === language)}
          getOptionLabel={option => option.name}
          options={languages}
          onChange={(e) => setLanguage(e.id)}
          styles={customSelectStyles}
          aria-label="Language"
        />
      </Form.Group>
      <div className="d-flex flex-column mb-2">
        <span className="font-weight-bold">
          {translate('screening_questionnaire.description')}
        </span>
        <span>{screeningQuestionnaire?.description}</span>
      </div>

      <div className="d-flex flex-column mb-3">
        <span className="font-weight-bold">
          {translate('screening_questionnaire.number_of_question')}
        </span>
        <span>{screeningQuestionnaire.total_question}</span>
      </div>

      {screeningQuestionnaire?.sections?.map((section, index) => (
        <div key={index}>
          <>
            <div className="mb-3">
              <span className="font-weight-bold">
                {section.title}
              </span>
            </div>

            {section.questions?.map((question, index) => (
              <Accordion key={index}>
                <Card className="question-card mb-1">
                  <Accordion.Toggle eventKey={index + 1} className="card-header view-question-card-header d-flex justify-content-between border-0">
                    <h6>{translate('questionnaire.question_number', { number: index + 1 })}</h6>
                    <ContextAwareToggle eventKey={(index + 1).toString()} />
                  </Accordion.Toggle>

                  <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body>
                      {question?.file && (
                        <img
                          className="img-thumbnail"
                          src={`${process.env.REACT_APP_API_BASE_URL}/file/${question.file?.id}`}
                          alt=""
                        />
                      )}
                      <div className="mb-2 mt-2">
                        {question.question_text}
                      </div>
                      {question.options?.map((option, index) => (
                        <div key={index}>
                          {(question.question_type === SCREENING_QUESTION_TYPE.CHECKBOX || question.question_type === SCREENING_QUESTION_TYPE.RADIO) && (
                            <Form.Check
                              aria-label={option.option_text}
                              inline label={option.option_text}
                              type={question.question_type}
                              disabled
                            />
                          )}
                          {question.question_type === SCREENING_QUESTION_TYPE.RATING && (
                            <>
                              <div>
                                <span className="font-weight-bold">{translate('question.min')}:</span>
                                <span>{option.min}</span>
                              </div>
                              <div>
                                <span className="font-weight-bold">{translate('question.max')}:</span>
                                <span>{option.max}</span>
                              </div>
                            </>
                          )}
                          {question.question_type === SCREENING_QUESTION_TYPE.OPEN_TEXT && (
                            <Form.Group controlId="formValue">
                              <Form.Control
                                disabled
                                type="text"
                                aria-label="Text input box"
                              />
                            </Form.Group>
                          )}
                          {question.question_type === SCREENING_QUESTION_TYPE.OPEN_NUMBER && (
                            <Form.Group controlId="formValue">
                              <Form.Control
                                disabled
                                type="number"
                                aria-label="Number input box"
                              />
                            </Form.Group>
                          )}
                          {question.question_type === SCREENING_QUESTION_TYPE.NOTE && (
                            <p>{option.option_text}</p>
                          )}
                        </div>
                      ))}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            ))}
          </>
        </div>
      ))}

      {screeningQuestionnaire?.auto_translated && (
        <GoogleTranslationAttribute />
      )}
    </Dialog>
  );
};

ViewScreeningQuestionnaire.propTypes = {
  id: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default ViewScreeningQuestionnaire;

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

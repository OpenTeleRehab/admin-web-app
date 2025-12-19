import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { BsFillGearFill, BsPlus, BsTrash } from 'react-icons/bs';
import { Button, CloseButton, Col, Nav, Row, Tab } from 'react-bootstrap';
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES, SCREENING_QUESTION_TYPE } from '../../../../../variables/questionnaire';
import Select from '../../../../../components/V2/Form/Select';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES.sections[0].questions[0].logics[0];

const QuestionSetting = ({
  sectionIndex,
  questionIndex,
  control,
  watch,
  onClose,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const [target, setTarget] = useState(undefined);
  const [isTargetQuestionTypeSelected, setIsTargetQuestionTypeSelected] = useState(undefined);

  const question = watch(`sections.${sectionIndex}.questions.${questionIndex}`);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.logics`,
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.endsWith('target_question_id')) {
        const questions = watch(`sections.${sectionIndex}.questions`);
        const targetQuestionId = watch(name);

        setTarget(questions.find(item => item.id === targetQuestionId));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (target?.question_type) {
      if ([SCREENING_QUESTION_TYPE.CHECKBOX, SCREENING_QUESTION_TYPE.RADIO].includes(target.question_type)) {
        setIsTargetQuestionTypeSelected(true);
      } else {
        setIsTargetQuestionTypeSelected(false);
      }
    } else {
      setIsTargetQuestionTypeSelected(undefined);
    }
  }, [target]);

  const getTargetQuestions = () => {
    const questions = watch(`sections.${sectionIndex}.questions`);

    if (questions.length) {
      const targetQuestions = questions.slice(0, questionIndex);

      if (targetQuestions.length) {
        return targetQuestions.map((item) => ({
          value: item.id,
          label: item.question_text,
        }));
      }
    }

    return [];
  };

  const getTargetQuestionOptions = (index) => {
    const logic = watch(`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}`);

    const questions = watch(`sections.${sectionIndex}.questions`);
    const question = questions.find(item => item.id === logic.target_question_id);

    if (question.options?.length) {
      return question.options.map((item, index) => ({
        value: item.id ?? index,
        label: item.option_text,
      }));
    }

    return [];
  };

  return (
    <div className="question-setting-popover">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <BsFillGearFill size={20} /> <span className="ml-2">{translate('setting')}</span>
        </div>
        <CloseButton
          aria-label="Close question setting"
          onClick={() => onClose(false)}
        />
      </div>
      <Tab.Container defaultActiveKey="skip_logic">
        <Row>
          <Col md={2}>
            <Nav variant="pills" className="flex-column mx-0">
              <Nav.Item>
                <Nav.Link eventKey="skip_logic">
                  {translate('question.skip_logic')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={10}>
            <Tab.Content>
              <p>{translate('screening_questionnaire.skip_logic.notice')}</p>

              <Tab.Pane eventKey="skip_logic">
                {fields.map((field, index) => (
                  <Row key={index}>
                    <Col xs={5} sm={5}>
                      <Select
                        control={control}
                        name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.target_question_id`}
                        placeholder={translate('questionnaire.select_question.placeholder')}
                        options={getTargetQuestions()}
                      />
                    </Col>
                    <Col xs={3} sm={3}>
                      {question.logics?.length && question.logics[index].target_question_id !== null && (
                        <>
                          {isTargetQuestionTypeSelected ? (
                            <Select
                              control={control}
                              name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.condition_rule`}
                              options={[
                                { value: 'was_answered', label: 'Was answered' },
                                { value: 'was_not_answered', label: 'Was not answered' },
                                { value: 'equal', label: 'Equal' },
                                { value: 'not_equal', label: 'Not equal' },
                              ]}
                            />
                          ) : (
                            <Select
                              control={control}
                              name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.condition_rule`}
                              options={[
                                { value: 'equal', label: 'Equal' },
                                { value: 'not_equal', label: 'Not equal' },
                              ]}
                            />
                          )}
                        </>
                      )}
                    </Col>
                    <Col xs={3} sm={3}>
                      {(question.logics?.length && (question.logics[index].condition_rule === 'equal' || question.logics[index].condition_rule === 'not_equal')) && (
                        <Select
                          control={control}
                          name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.target_option_id`}
                          options={getTargetQuestionOptions(index)}
                        />
                      )}
                    </Col>
                    <Col xs={1} sm={1}>
                      <Button
                        aria-label="Remove condition"
                        variant="link"
                        size="sm"
                        className="text-danger px-0 ml-2"
                        disabled={fields.length <= 1}
                        onClick={() => remove(index)}
                      >
                        <BsTrash size={20} />
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button
                  aria-label="Add another condition"
                  onClick={() => append(defaultValues)}
                >
                  <BsPlus size={16} /> Add another condition
                </Button>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

QuestionSetting.propTypes = {
  sectionIndex: PropTypes.number,
  questionIndex: PropTypes.number,
  control: PropTypes.object,
  watch: PropTypes.func,
  onClose: PropTypes.func,
};

export default withLocalize(QuestionSetting);

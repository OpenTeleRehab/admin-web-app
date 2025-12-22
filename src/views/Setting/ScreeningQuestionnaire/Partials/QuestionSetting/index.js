import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { BsFillGearFill, BsPlus, BsTrash } from 'react-icons/bs';
import { Button, CloseButton, Col, Nav, Row, Tab } from 'react-bootstrap';
import { SCREENING_QUESTION_TYPE } from '../../../../../variables/questionnaire';
import Select from '../../../../../components/V2/Form/Select';
import Input from '../../../../../components/V2/Form/Input';

const QuestionSetting = ({
  sectionIndex,
  questionIndex,
  control,
  watch,
  onClose,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const questions = watch(`sections.${sectionIndex}.questions`);
  const question = questions[questionIndex];

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.logics`,
  });

  const getTargetQuestions = () => {
    const questions = watch(`sections.${sectionIndex}.questions`);

    if (questions.length) {
      const targetQuestions = questions
        .slice(0, questionIndex)
        .filter(question => (question.question_type !== SCREENING_QUESTION_TYPE.NOTE));

      if (targetQuestions.length) {
        return targetQuestions.map((item) => ({
          value: item.id,
          label: item.question_text,
        }));
      }
    }

    return [];
  };

  const getConditionRuleOptions = (logicIndex) => {
    const selectedTargetQuestionType = getTargetQuestionType(logicIndex);

    if (selectedTargetQuestionType) {
      if ([SCREENING_QUESTION_TYPE.CHECKBOX, SCREENING_QUESTION_TYPE.RADIO].includes(selectedTargetQuestionType)) {
        return [
          { value: 'was_answered', label: translate('question.condition_rule.was_answered') },
          { value: 'was_not_answered', label: translate('question.condition_rule.was_not_answered') },
          { value: 'equal', label: translate('question.condition_rule.equal') },
          { value: 'not_equal', label: translate('question.condition_rule.not_equal') },
        ];
      }
      if ([SCREENING_QUESTION_TYPE.OPEN_TEXT, SCREENING_QUESTION_TYPE.OPEN_NUMBER, SCREENING_QUESTION_TYPE.RATING].includes(selectedTargetQuestionType)) {
        return [
          { value: 'equal', label: translate('question.condition_rule.equal') },
          { value: 'not_equal', label: translate('question.condition_rule.not_equal') },
        ];
      }
    }

    return [];
  };

  const getTargetQuestionType = (logicIndex) => {
    if (question?.logics?.length) {
      const selectedTargetQuestionId = question.logics[logicIndex]?.target_question_id;
      const selectedTargetQuestion = questions.find(item => item.id === selectedTargetQuestionId);

      if (selectedTargetQuestion) {
        return selectedTargetQuestion.question_type;
      }
    }

    return null;
  };

  const getTargetQuestionOptions = (index) => {
    const logic = watch(`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}`);

    const questions = watch(`sections.${sectionIndex}.questions`);
    const question = questions.find(item => item.id === logic.target_question_id);

    if (question?.options?.length) {
      return question.options.map((item) => ({
        value: item.id,
        label: item.option_text,
      }));
    }

    return [];
  };

  const showTargetQuestionOptions = (index) => {
    if (question.logics.length) {
      const conditionRule = question.logics[index].condition_rule;

      return conditionRule === 'equal' || conditionRule === 'not_equal';
    }

    return false;
  };

  const handleAddCondition = () => {
    append({
      id: crypto.randomUUID(),
      question_id: null,
      target_question_id: null,
      target_option_id: null,
      target_option_value: null,
      condition_type: 'skip',
      condition_rule: null,
    });
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
                  <Row key={field.id}>
                    <Col xs={5} sm={5}>
                      <Select
                        control={control}
                        name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.target_question_id`}
                        placeholder={translate('questionnaire.select_question.placeholder')}
                        options={getTargetQuestions()}
                      />
                    </Col>
                    <Col xs={3} sm={3}>
                      {!!getConditionRuleOptions(index).length && (
                        <Select
                          control={control}
                          name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.condition_rule`}
                          options={getConditionRuleOptions(index)}
                        />
                      )}
                    </Col>
                    <Col xs={3} sm={3}>
                      {!!showTargetQuestionOptions(index) && (
                        <>
                          {[SCREENING_QUESTION_TYPE.CHECKBOX, SCREENING_QUESTION_TYPE.RADIO].includes(getTargetQuestionType(index)) && (
                            <Select
                              control={control}
                              name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.target_option_id`}
                              options={getTargetQuestionOptions(index)}
                            />
                          )}
                          {[SCREENING_QUESTION_TYPE.RATING].includes(getTargetQuestionType(index)) && (
                            <Input
                              control={control}
                              name={`sections.${sectionIndex}.questions.${questionIndex}.logics.${index}.target_option_value`}
                              placeholder={translate('question.target_option_value.placeholder')}
                            />
                          )}
                        </>
                      )}
                    </Col>
                    <Col xs={1} sm={1}>
                      <Button
                        aria-label="Remove condition"
                        variant="link"
                        size="sm"
                        className="text-danger px-0 ml-2"
                        onClick={() => remove(index)}
                      >
                        <BsTrash size={20} />
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button
                  aria-label="Add another condition"
                  onClick={handleAddCondition}
                >
                  <BsPlus size={16} /> {translate('question.add_another_condition')}
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

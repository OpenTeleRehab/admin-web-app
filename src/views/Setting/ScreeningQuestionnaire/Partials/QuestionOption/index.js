import React from 'react';
import PropTypes from 'prop-types';
import { BsPlus, BsX } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { useFieldArray } from 'react-hook-form';
import Input from '../../../../../components/V2/Form/Input';
import FileUpload from '../../../../../components/V2/Form/FileUpload';
import {
  DEFAULT_SCREENING_QUESTIONNAIRE_VALUES,
  SCREENING_QUESTION_TYPE,
} from '../../../../../variables/questionnaire';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES.sections[0].questions[0].options[0];

const QuestionOption = ({
  sectionIndex,
  questionIndex,
  control,
  watch,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const question = watch(`sections.${sectionIndex}.questions.${questionIndex}`);
  const fieldName = `sections.${sectionIndex}.questions.${questionIndex}.options`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const handleAddOption = () => {
    append({
      ...defaultValues,
      id: crypto.randomUUID(),
    });
  };

  const disableRemoveOption = (index) => {
    const option = watch(`sections.${sectionIndex}.questions.${questionIndex}.options.${index}`);

    return question.options.length <= 2 || typeof option.id === 'number';
  };

  return (
    <>
      {[SCREENING_QUESTION_TYPE.CHECKBOX, SCREENING_QUESTION_TYPE.RADIO].includes(question.question_type) && (
        <>
          {fields.map((field, index) => (
            <Row key={field.id}>
              <Col xs={6} sm={4}>
                <div className="d-flex">
                  <Form.Check
                    disabled
                    type={question.question_type}
                    className="mt-2"
                    aria-label="Answer option"
                  />
                  <div className="w-100">
                    <Input
                      control={control}
                      name={`${fieldName}.${index}.option_text`}
                      placeholder={translate('question.option_text.placeholder')}
                      rules={{ required: translate('question.option_text.required') }}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={4} sm={3}>
                <Input
                  control={control}
                  name={`${fieldName}.${index}.option_point`}
                  type="number"
                  min={0}
                  placeholder={translate('question.point.placeholder')}
                  rules={{ required: translate('question.point.required') }}
                />
              </Col>
              <Col xs={1} sm={1}>
                <Button
                  aria-label="Remove answer option"
                  variant="outline-danger"
                  className="remove-btn d-flex align-items-center justify-content-center mt-1"
                  disabled={disableRemoveOption(index)}
                  onClick={() => remove(index)}
                >
                  <BsX size={16} />
                </Button>
              </Col>
              <Col xs={2} sm={2}>
                <FileUpload
                  control={control}
                  name={`${fieldName}.${index}.file`}
                  label={translate('question.media_upload')}
                />
              </Col>
            </Row>
          ))}
          <Row>
            <Col xs={12}>
              <Button
                aria-label="Add more option"
                className="py-0"
                variant="link"
                onClick={handleAddOption}
              >
                <BsPlus size={16} /> {translate('question.add.more.answer')}
              </Button>
            </Col>
          </Row>
        </>
      )}
      {question.question_type === SCREENING_QUESTION_TYPE.OPEN_TEXT && (
        <Row>
          <Col lg={6}>
            <Input
              disabled
              name=""
              control={control}
            />
          </Col>
        </Row>
      )}
      {question.question_type === SCREENING_QUESTION_TYPE.OPEN_NUMBER && (
        <Row>
          <Col xs={4} md={4}>
            <Input
              disabled
              name=""
              control={control}
              rules={{ required: translate('question.option_text.required') }}
            />
          </Col>
          <Col xs={4} md={3}>
            <Input
              control={control}
              name={`${fieldName}.0.option_point`}
              type="number"
              min={0}
              placeholder={translate('question.point.placeholder')}
              rules={{ required: translate('question.point.required') }}
            />
          </Col>
          <Col xs={4} md={3}>
            <Input
              control={control}
              name={`${fieldName}.0.threshold`}
              type="number"
              min={0}
              placeholder={translate('question.answer_threshold')}
              rules={{ required: translate('question.answer.threshold.required') }}
            />
          </Col>
        </Row>
      )}
      {question.question_type === SCREENING_QUESTION_TYPE.RATING && (
        <>
          <Row>
            <Col xs={4}>
              <Input
                control={control}
                label={translate('question.min')}
                name={`${fieldName}.0.min`}
                type="number"
                min={0}
                rules={{ required: translate('question.min.required') }}
              />
            </Col>
            <Col xs={4}>
              <Input
                control={control}
                label={translate('question.min_note')}
                name={`${fieldName}.0.min_note`}
                rules={{ required: translate('question.min_note.required') }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Input
                control={control}
                label={translate('question.max')}
                name={`${fieldName}.0.max`}
                type="number"
                min={0}
                rules={{ required: translate('question.max.required') }}
              />
            </Col>
            <Col xs={4}>
              <Input
                control={control}
                label={translate('question.max_note')}
                name={`${fieldName}.0.max_note`}
                rules={{ required: translate('question.max_note.required') }}
              />
            </Col>
          </Row>
        </>
      )}
      {question.question_type === SCREENING_QUESTION_TYPE.NOTE && (
        <Row>
          <Col>
            <Input
              control={control}
              name={`${fieldName}.0.option_text`}
              placeholder={translate('question.answer.note.placeholder')}
              rules={{ required: translate('question.answer.note.required') }}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

QuestionOption.propTypes = {
  sectionIndex: PropTypes.number,
  questionIndex: PropTypes.number,
  control: PropTypes.object,
  watch: PropTypes.func,
};

export default withLocalize(QuestionOption);

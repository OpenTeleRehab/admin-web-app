import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BsPlus, BsX } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { useFieldArray } from 'react-hook-form';
import { SCREENING_QUESTION_TYPE } from '../../../../../variables/questionnaire';
import Input from '../../../../../components/V2/Form/Input';
import FileUpload from '../../../../../components/V2/Form/FileUpload';

const QuestionOption = ({
  defaultValue,
  sectionIndex,
  questionIndex,
  control,
  watch,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const question = watch(`sections.${sectionIndex}.questions.${questionIndex}`);
  const fieldName = `sections.${sectionIndex}.questions.${questionIndex}.options`;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: fieldName,
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.endsWith('question_type')) {
        const questionType = value.sections[sectionIndex].questions[questionIndex].question_type;

        if (questionType === SCREENING_QUESTION_TYPE.CHECKBOX || questionType === SCREENING_QUESTION_TYPE.RADIO) {
          replace([defaultValue, defaultValue]);
        } else {
          replace([defaultValue]);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAddOption = () => {
    append(defaultValue);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Row key={index}>
          {(question.question_type === 'checkbox' || question.question_type === 'radio') && (
            <>
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
                  placeholder={translate('question.point.placeholder')}
                  rules={{ required: translate('question.point.required') }}
                />
              </Col>
              <Col xs={1} sm={1}>
                <Button
                  aria-label="Remove answer option"
                  variant="outline-danger"
                  className="remove-btn d-flex align-items-center justify-content-center mt-1"
                  disabled={question.options.length <= 2}
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
            </>
          )}

          {question.question_type === 'open-text' && (
            <>
              <Col lg={6}>
                <Input
                  disabled
                  name=""
                  control={control}
                />
              </Col>
            </>
          )}

          {question.question_type === 'open-number' && (
            <>
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
                  name={`${fieldName}.${index}.option_point`}
                  type="number"
                  placeholder={translate('question.point.placeholder')}
                  rules={{ required: translate('question.point.required') }}
                />
              </Col>
              <Col xs={4} md={3}>
                <Input
                  control={control}
                  name={`${fieldName}.${index}.threshold`}
                  type="number"
                  placeholder={translate('question.answer_threshold')}
                  rules={{ required: translate('question.answer.threshold.required') }}
                />
              </Col>
            </>
          )}

          {question.question_type === 'rating' && (
            <>
              <Col xs={4}>
                <Input
                  control={control}
                  label={translate('question.min')}
                  name={`${fieldName}.${index}.min`}
                  rules={{ required: translate('question.min.required') }}
                />
              </Col>
              <Col xs={4}>
                <Input
                  control={control}
                  label={translate('question.max')}
                  name={`${fieldName}.${index}.max`}
                  rules={{ required: translate('question.max.required') }}
                />
              </Col>
            </>
          )}

          {question.question_type === 'note' && (
            <>
              <Col>
                <Input
                  control={control}
                  name={`${fieldName}.${index}.option_text`}
                  placeholder={translate('question.answer.note.placeholder')}
                  rules={{ required: translate('question.answer.note.required') }}
                />
              </Col>
            </>
          )}
        </Row>
      ))}

      {(question.question_type === 'checkbox' || question.question_type === 'radio') && (
        <Button
          aria-label="Add more option"
          className="py-0"
          variant="link"
          onClick={handleAddOption}
        >
          <BsPlus size={16} /> {translate('question.add.more.answer')}
        </Button>
      )}
    </>
  );
};

QuestionOption.propTypes = {
  defaultValue: PropTypes.object,
  sectionIndex: PropTypes.number,
  questionIndex: PropTypes.number,
  control: PropTypes.object,
  watch: PropTypes.func,
};

export default withLocalize(QuestionOption);

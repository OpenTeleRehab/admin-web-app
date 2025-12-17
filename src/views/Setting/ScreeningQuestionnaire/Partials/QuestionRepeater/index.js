import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { FaCopy } from 'react-icons/fa';
import { BsArrowsMove, BsGearFill, BsPlusCircle, BsTrash, BsUpload, BsX } from 'react-icons/bs';
import { SCREENING_QUESTION_TYPE } from '../../../../../variables/questionnaire';
import Input from '../../../../../components/V2/Form/Input';
import Select from '../../../../../components/V2/Form/Select';
import Checkbox from '../../../../../components/V2/Form/Checkbox';
import QuestionOption from '../QuestionOption';
import QuestionSetting from '../QuestionSetting';
import FileUpload from '../../../../../components/V2/Form/FileUpload';

const QuestionRepeater = ({
  defaultValue,
  sectionIndex,
  control,
  watch,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [showSetting, setShowSetting] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  const handleAddQuestion = () => {
    append(defaultValue);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Card key={index} className="question-card mb-2">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Card.Title className="mb-0">
                {translate('questionnaire.question_number', { number: index + 1 })}
              </Card.Title>

              <Button
                aria-label="Move question"
                variant="link"
                size="sm"
                className="text-dark drag-button"
              >
                <BsArrowsMove size={20} />
              </Button>

              <div className="d-flex gap-3">
                <Button
                  aria-label="Setting"
                  variant="link"
                  size="sm"
                  className="text-dark px-0 ml-2"
                  onClick={() => setShowSetting(!showSetting)}
                >
                  <BsGearFill size={20} />
                </Button>
                <Button
                  aria-label="Clone Question"
                  variant="link"
                  size="sm"
                  className="text-primary px-0 ml-2"
                  onClick={() => {}}
                >
                  <FaCopy size={20} />
                </Button>
                <Button
                  aria-label="Remove Question"
                  variant="link"
                  size="sm"
                  className="text-danger px-0 ml-2"
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  <BsTrash size={20} />
                </Button>
              </div>
            </div>
            <Row>
              <Col lg={7}>
                <Input
                  control={control}
                  name={`sections.${sectionIndex}.questions.${index}.question_text`}
                  placeholder={translate('questionnaire.question_text.placeholder')}
                  rules={{ required: translate('questionnaire.title.required') }}
                />
              </Col>
              <Col lg={5}>
                <Select
                  control={control}
                  name={`sections.${sectionIndex}.questions.${index}.question_type`}
                  options={[
                    { value: SCREENING_QUESTION_TYPE.CHECKBOX, label: translate('question.type.checkbox') },
                    { value: SCREENING_QUESTION_TYPE.RADIO, label: translate('question.type.multiple_choice') },
                    { value: SCREENING_QUESTION_TYPE.OPEN_TEXT, label: translate('question.type.open_ended_free_text') },
                    { value: SCREENING_QUESTION_TYPE.OPEN_NUMBER, label: translate('question.type.open_ended_numbers_only') },
                    { value: SCREENING_QUESTION_TYPE.RATING, label: translate('question.type.rating') },
                    { value: SCREENING_QUESTION_TYPE.NOTE, label: translate('question.type.note') },
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <FileUpload
                  control={control}
                  name={`sections.${sectionIndex}.questions.${index}.file`}
                  label={translate('question.media_upload')}
                />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="position-relative">
            <div className={showSetting ? 'd-none' : ''}>
              <div className="mb-3">
                <QuestionOption
                  defaultValue={defaultValue.options[0]}
                  sectionIndex={sectionIndex}
                  questionIndex={index}
                  control={control}
                  watch={watch}
                />
              </div>
              <Checkbox
                control={control}
                name={`sections.${sectionIndex}.questions.${index}.mandatory`}
                label={translate('question.mandatory')}
              />
            </div>
            <div className={showSetting ? '' : 'd-none'}>
              <QuestionSetting
                question={watch(`sections.${sectionIndex}.questions.${index}`)}
                control={control}
                onClose={setShowSetting}
              />
            </div>
          </Card.Body>
        </Card>
      ))}
      <Button
        aria-label="Add Question"
        className="px-0"
        variant="link"
        onClick={handleAddQuestion}
      >
        <BsPlusCircle size={20} /> {translate('questionnaire.new.question')}
      </Button>
    </>
  );
};

QuestionRepeater.propTypes = {
  defaultValue: PropTypes.object,
  sectionIndex: PropTypes.number,
  control: PropTypes.object,
  watch: PropTypes.func,
};

export default withLocalize(QuestionRepeater);

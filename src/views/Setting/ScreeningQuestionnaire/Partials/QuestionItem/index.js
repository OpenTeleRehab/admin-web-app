import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { FaCopy } from 'react-icons/fa';
import { BsArrowsMove, BsGear, BsGearFill, BsTrash } from 'react-icons/bs';
import { SCREENING_QUESTION_TYPE } from '../../../../../variables/questionnaire';
import Input from '../../../../../components/V2/Form/Input';
import Select from '../../../../../components/V2/Form/Select';
import Checkbox from '../../../../../components/V2/Form/Checkbox';
import FileUpload from '../../../../../components/V2/Form/FileUpload';
import QuestionOption from '../QuestionOption';
import QuestionSetting from '../QuestionSetting';

const QuestionItem = ({
  sectionIndex,
  questionIndex,
  provided,
  control,
  setValue,
  watch,
  untranslatable,
  onClone,
  onRemove,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [showSetting, setShowSetting] = useState(false);

  const questions = watch(`sections.${sectionIndex}.questions`);
  const question = watch(`sections.${sectionIndex}.questions.${questionIndex}`);

  const disableMove = questions?.length <= 1 || typeof question.id === 'number' || untranslatable;
  const disableSetting = questionIndex === 0 || untranslatable;
  const disableRemoveQuestion = questions?.length <= 1 || typeof question.id === 'number' || untranslatable;
  const disableQuestionType = typeof question.id === 'number' || untranslatable;

  useEffect(() => {
    if (questionIndex === 0) {
      setShowSetting(false);
    }
  }, [questionIndex]);

  return (
    <Card className="question-card mb-2">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">
            {translate('questionnaire.question_number', { number: questionIndex + 1 })}
          </Card.Title>

          <div {...provided.dragHandleProps}>
            <Button
              aria-label="Move question"
              disabled={disableMove}
              variant="link"
              size="sm"
              className="text-dark drag-button"
            >
              <BsArrowsMove size={20} />
            </Button>
          </div>

          <div className="d-flex gap-3">
            <Button
              aria-label="Setting"
              disabled={disableSetting}
              variant="link"
              size="sm"
              className="text-primary px-0 ml-2"
              onClick={() => setShowSetting(!showSetting)}
            >
              {question.logics.length ? (
                <BsGearFill size={20} />
              ) : (
                <BsGear size={20} />
              )}
            </Button>
            <Button
              aria-label="Clone Question"
              disabled={untranslatable}
              variant="link"
              size="sm"
              className="text-primary px-0 ml-2"
              onClick={() => onClone(questionIndex)}
            >
              <FaCopy size={20} />
            </Button>
            <Button
              aria-label="Remove Question"
              variant="link"
              size="sm"
              className="text-danger px-0 ml-2"
              disabled={disableRemoveQuestion}
              onClick={onRemove}
            >
              <BsTrash size={20} />
            </Button>
          </div>
        </div>
        <Row>
          <Col lg={7}>
            <Input
              control={control}
              name={`sections.${sectionIndex}.questions.${questionIndex}.question_text`}
              placeholder={translate('questionnaire.question_text.placeholder')}
              rules={{ required: translate('questionnaire.title.required') }}
            />
          </Col>
          <Col lg={5}>
            <Select
              control={control}
              name={`sections.${sectionIndex}.questions.${questionIndex}.question_type`}
              options={[
                { value: SCREENING_QUESTION_TYPE.CHECKBOX, label: translate('question.type.checkbox') },
                { value: SCREENING_QUESTION_TYPE.RADIO, label: translate('question.type.multiple_choice') },
                { value: SCREENING_QUESTION_TYPE.OPEN_TEXT, label: translate('question.type.open_ended_free_text') },
                { value: SCREENING_QUESTION_TYPE.OPEN_NUMBER, label: translate('question.type.open_ended_numbers_only') },
                { value: SCREENING_QUESTION_TYPE.RATING, label: translate('question.type.rating') },
                { value: SCREENING_QUESTION_TYPE.NOTE, label: translate('question.type.note') },
              ]}
              isDisabled={disableQuestionType}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FileUpload
              control={control}
              name={`sections.${sectionIndex}.questions.${questionIndex}.file`}
              label={translate('question.media_upload')}
              disabled={untranslatable}
            />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="position-relative">
        <div className={showSetting ? 'd-none' : ''}>
          <div className="mb-3">
            <QuestionOption
              sectionIndex={sectionIndex}
              questionIndex={questionIndex}
              control={control}
              setValue={setValue}
              watch={watch}
              untranslatable={untranslatable}
            />
          </div>
          <Checkbox
            control={control}
            name={`sections.${sectionIndex}.questions.${questionIndex}.mandatory`}
            label={translate('question.mandatory')}
            disabled={untranslatable}
          />
        </div>
        <div className={showSetting ? '' : 'd-none'}>
          <QuestionSetting
            sectionIndex={sectionIndex}
            questionIndex={questionIndex}
            control={control}
            watch={watch}
            onClose={setShowSetting}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

QuestionItem.propTypes = {
  sectionIndex: PropTypes.number,
  questionIndex: PropTypes.number,
  provided: PropTypes.object,
  control: PropTypes.object,
  setValue: PropTypes.func,
  watch: PropTypes.func,
  untranslatable: PropTypes.bool,
  onClone: PropTypes.func,
  onRemove: PropTypes.func,
};

export default withLocalize(QuestionItem);

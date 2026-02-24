import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { FaCopy } from 'react-icons/fa';
import { BsArrowsMove, BsGear, BsGearFill, BsTrash } from 'react-icons/bs';
import { useEditableLanguage } from '../../../../../hooks/useEditableLanguage';
import { SCREENING_QUESTION_TYPE } from '../../../../../variables/questionnaire';
import Input from '../../../../../components/V2/Form/Input';
import Select from '../../../../../components/V2/Form/Select';
import Checkbox from '../../../../../components/V2/Form/Checkbox';
import FileUpload from '../../../../../components/V2/Form/FileUpload';
import QuestionOption from '../QuestionOption';
import QuestionSetting from '../QuestionSetting';
import Dialog from '../../../../../components/Dialog';
import { useFormState } from 'react-hook-form';
import { get } from 'lodash';

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
  isDraft,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [showSetting, setShowSetting] = useState(false);
  const [showConfirmDeleteQuestion, setShowConfirmDeleteSection] =
    useState(false);

  const questions = watch(`sections.${sectionIndex}.questions`);
  const question = watch(`sections.${sectionIndex}.questions.${questionIndex}`);

  const isEditableLanguage = useEditableLanguage(watch('lang'));

  const questionPath = `sections.${sectionIndex}.questions.${questionIndex}`;
  const { errors } = useFormState({ control });
  const questionError = get(errors, questionPath);

  const hasAnyError = (err) => {
    if (!err) return false;
    if (typeof err === 'object' && err.message) return true;
    if (Array.isArray(err)) return err.some(hasAnyError);
    if (typeof err === 'object') return Object.values(err).some(hasAnyError);
    return false;
  };
  const hasQuestionError = hasAnyError(questionError);

  const disableMove =
    questions?.length <= 1 ||
    typeof question?.id === 'number' ||
    untranslatable;
  const disableSetting = questionIndex === 0 || untranslatable;

  const disableRemoveQuestion = () => {
    if (isDraft) {
      return questions?.length <= 1 || untranslatable;
    } else {
      return (
        questions?.length <= 1 ||
        typeof question?.id === 'number' ||
        untranslatable
      );
    }
  };
  const disableQuestionType = () => {
    if (isDraft) {
      return untranslatable;
    } else {
      return typeof question?.id === 'number' || untranslatable;
    }
  };

  useEffect(() => {
    if (questionIndex === 0) {
      setShowSetting(false);
    }
  }, [questionIndex]);

  const handleCancelRemoveQuestion = () => {
    setShowConfirmDeleteSection(false);
  };

  const handleConfirmRemoveQuestion = () => {
    onRemove();
    setShowConfirmDeleteSection(false);
  };

  if (!question) {
    return null;
  }

  return (
    <Card className="question-card mb-2">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className={`mb-0 ${hasQuestionError ? 'text-danger' : ''}`}>
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
              className={`${hasQuestionError ? 'text-danger' : 'text-primary'} px-0 ml-2`}
              onClick={() => setShowSetting(!showSetting)}
            >
              {question?.logics?.length ? (
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
              disabled={disableRemoveQuestion()}
              onClick={() => setShowConfirmDeleteSection(true)}
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
              disabled={!isEditableLanguage}
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
              isDisabled={disableQuestionType()}
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
              isDraft={isDraft}
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
      <Dialog
        show={showConfirmDeleteQuestion}
        title={translate('screening_questionnaire.delete_question')}
        cancelLabel={translate('common.no')}
        onCancel={handleCancelRemoveQuestion}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirmRemoveQuestion}
      >
        <p>
          {translate(
            'screening_questionnaire.delete_question_confirmation_message',
          )}
        </p>
      </Dialog>
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
  isDraft: PropTypes.bool,
};

export default withLocalize(QuestionItem);

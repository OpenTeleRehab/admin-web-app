import 'react-datetime/css/react-datetime.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import SectionRepeater from './Partials/SectionRepeater';
import Dialog from '../../../components/Dialog';
import Input from '../../../components/V2/Form/Input';
import Select from '../../../components/V2/Form/Select';
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES, SCREENING_QUESTION_TYPE } from '../../../variables/questionnaire';
import {
  createScreeningQuestionnaire,
  getScreeningQuestionnaire,
  updateScreeningQuestionnaire,
} from '../../../store/screeningQuestionnaire/actions';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES;
const defaultQuestionOptionValues = defaultValues.sections[0].questions[0].options;

const CreateScreeningQuestionnaire = ({ show, editId, handleClose }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { screeningQuestionnaire } = useSelector(state => state.screeningQuestionnaire);
  const { languages } = useSelector(state => state.language);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);

  const {
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      ...defaultValues,
      lang: languages.length ? languages[0].id : null,
    }
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // TODO: Reset question logic when question option removed
      // Reset question logic when question removed
      if (name?.endsWith('.questions')) {
        const questionIds = value.sections.flatMap(section => section.questions.map(question => question.id));

        value.sections.forEach((section, sectionIndex) => {
          section.questions?.forEach((question, questionIndex) => {
            const logics = question.logics.filter(logic => questionIds.includes(logic.target_question_id));

            setValue(`sections.${sectionIndex}.questions.${questionIndex}.logics`, logics ?? []);
          });
        });
      }

      // Reset question logic when question type changed
      if (name?.endsWith('.question_type') && type === 'change') {
        const question = watch(name.replace('.question_type', ''));

        if ([SCREENING_QUESTION_TYPE.CHECKBOX, SCREENING_QUESTION_TYPE.RADIO].includes(question.question_type)) {
          setValue(name.replace('.question_type', '.options'), [
            {
              ...defaultQuestionOptionValues[0],
              id: crypto.randomUUID(),
            },
            {
              ...defaultQuestionOptionValues[0],
              id: crypto.randomUUID(),
            }
          ]);
        } else {
          setValue(name.replace('.question_type', '.options'), [
            {
              ...defaultQuestionOptionValues[0],
              id: crypto.randomUUID(),
            },
          ]);
        }

        if ([SCREENING_QUESTION_TYPE.OPEN_TEXT, SCREENING_QUESTION_TYPE.OPEN_NUMBER, SCREENING_QUESTION_TYPE.RATING].includes(question.question_type)) {
          value.sections.forEach((sectionItem, sectionIndex) => {
            sectionItem.questions?.forEach((questionItem, questionIndex) => {
              questionItem.logics.forEach((logicItem, logicIndex) => {
                setValue(`sections.${sectionIndex}.questions.${questionIndex}.logics.${logicIndex}`, {
                  ...logicItem,
                  condition_rule: null,
                  target_option_id: null,
                });
              });
            });
          });
        }

        if (question.question_type === SCREENING_QUESTION_TYPE.NOTE) {
          value.sections.forEach((sectionItem, sectionIndex) => {
            sectionItem.questions?.forEach((questionItem, questionIndex) => {
              const logics = questionItem.logics.filter(logic => logic.target_question_id !== question.id);

              setValue(`sections.${sectionIndex}.questions.${questionIndex}.logics`, logics ?? []);
            });
          });
        }
      }

      if (name?.endsWith('.target_question_id') && type === 'change') {
        const logic = watch(name.replace('.target_question_id', ''));

        setValue(name.replace('.target_question_id', ''), {
          ...logic,
          target_option_id: null,
          target_option_value: null,
          condition_type: 'skip',
          condition_rule: null,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (editId) {
      dispatch(getScreeningQuestionnaire(editId));
    }
  }, [dispatch, editId]);

  useEffect(() => {
    if (editId && screeningQuestionnaire) {
      reset(screeningQuestionnaire, { keepDirtyValues: false });
    } else {
      reset(defaultValues, { keepDirtyValues: false });
    }
  }, [editId, screeningQuestionnaire]);

  const onSubmit = (data) => {
    if (editId) {
      // TODO: Show used questionnaire confirm dialog
      dispatch(updateScreeningQuestionnaire(editId, data)).then((response) => {
        if (response) {
          handleClose();
        }
      });
    } else {
      dispatch(createScreeningQuestionnaire(data)).then((response) => {
        if (response) {
          handleClose();
        }
      });
    }
  };

  return (
    <>
      <Dialog
        show={show}
        title={translate(editId ? 'questionnaire.edit' : 'questionnaire.new')}
        confirmLabel={editId ? translate('common.save') : translate('common.create')}
        size="xl"
        onConfirm={handleSubmit(onSubmit)}
        onCancel={handleClose}
        disabled={!isDirty}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={6}>
              <Input
                control={control}
                name="title"
                label={translate('questionnaire.title')}
                placeholder={translate('questionnaire.title.placeholder')}
                rules={{ required: translate('questionnaire.title.required') }}
              />
            </Col>
            <Col lg={6}>
              <Select
                isDisabled={!editId}
                label={translate('common.language')}
                placeholder={translate('placeholder.language')}
                control={control}
                name="lang"
                options={languages.map(language => ({
                  label: language.name,
                  value: language.id,
                }))}
              />
            </Col>
            <Col lg={12}>
              <Input
                control={control}
                name="description"
                label={translate('questionnaire.description')}
                placeholder={translate('questionnaire.description.placeholder')}
              />
            </Col>
          </Row>
          <SectionRepeater
            control={control}
            setValue={setValue}
            watch={watch}
          />
        </Form>
      </Dialog>

      <Dialog
        show={showConfirmUpdate}
        title={translate('screening_questionnaire.used_update_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleSubmit(onSubmit)}
      >
        <p>{translate('screening_questionnaire.used_update_confirmation_message')}</p>
      </Dialog>
    </>
  );
};

CreateScreeningQuestionnaire.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateScreeningQuestionnaire;

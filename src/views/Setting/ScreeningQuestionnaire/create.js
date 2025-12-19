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
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES } from '../../../variables/questionnaire';
import {
  createScreeningQuestionnaire,
  getScreeningQuestionnaire,
  updateScreeningQuestionnaire,
} from '../../../store/screeningQuestionnaire/actions';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES;

const CreateScreeningQuestionnaire = ({ show, editId, handleClose }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { screeningQuestionnaire } = useSelector(state => state.screeningQuestionnaire);
  const { languages } = useSelector(state => state.language);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);

  const {
    control,
    reset,
    resetField,
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
      if (name?.endsWith('.question_type') && type === 'change') {
        // Reset question option
        resetField(name.replace('.question_type', '.options'));
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
                rules={{ required: translate('questionnaire.description.required') }}
              />
            </Col>
          </Row>
          <SectionRepeater
            control={control}
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

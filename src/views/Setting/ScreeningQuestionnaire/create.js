import 'react-datetime/css/react-datetime.css';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import SectionRepeater from './Partials/SectionRepeater';
import Dialog from '../../../components/Dialog';
import Input from '../../../components/V2/Form/Input';
import Select from '../../../components/V2/Form/Select';
import { SCREENING_QUESTION_TYPE } from '../../../variables/questionnaire';
import {
  createScreeningQuestionnaire,
  getScreeningQuestionnaire,
  updateScreeningQuestionnaire,
} from '../../../store/screeningQuestionnaire/actions';

const defaultOptionValue = {
  option_text: '',
  option_point: '',
  threshold: null,
  min: null,
  max: null,
  file: null,
};

const defaultSectionValue = {
  title: '',
  description: '',
  questions: [
    {
      question_text: '',
      question_type: SCREENING_QUESTION_TYPE.CHECKBOX,
      mandatory: false,
      file: null,
      options: [defaultOptionValue, defaultOptionValue],
    },
  ],
};

const defaultValue = {
  title: '',
  description: '',
  sections: [defaultSectionValue],
};

const CreateScreeningQuestionnaire = ({ show, editId, handleClose }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { screeningQuestionnaire } = useSelector(state => state.screeningQuestionnaire);
  const { languages } = useSelector(state => state.language);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      ...defaultValue,
      lang: languages.length ? languages[0].id : null,
    }
  });

  useEffect(() => {
    if (editId) {
      dispatch(getScreeningQuestionnaire(editId));
    }
  }, [dispatch, editId]);

  useEffect(() => {
    if (editId && screeningQuestionnaire) {
      reset(screeningQuestionnaire, { keepDirtyValues: false });
    } else {
      reset(defaultValue, { keepDirtyValues: false });
    }
  }, [editId, screeningQuestionnaire]);

  const onSubmit = (data) => {
    if (editId) {
      dispatch(updateScreeningQuestionnaire(editId, data)).then((response) => {
        if (response.success) {
          handleClose();
        }
      });
    } else {
      dispatch(createScreeningQuestionnaire(data)).then((response) => {
        if (response.success) {
          handleClose();
        }
      });
    }
  };

  return (
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
          defaultValue={defaultSectionValue}
          control={control}
          watch={watch}
        />
      </Form>
    </Dialog>
  );
};

CreateScreeningQuestionnaire.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateScreeningQuestionnaire;

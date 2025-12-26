import React, { useState, useEffect } from 'react';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Form } from 'react-bootstrap';
import { createHealthCondition, updateHealthCondition, getHealthCondition } from 'store/healthCondition/actions';
import PropTypes from 'prop-types';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';
import GoogleTranslationAttribute from '../../../../components/GoogleTranslationAttribute';
import settings from '../../../../settings';
import { useEditableLanguage } from 'hooks/useEditableLanguage';

const CreateHealthCondition = ({ show, handleClose, editId, activeHealthConditionGroup }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const { healthCondition } = useSelector((state) => state.healthCondition);
  const { languages } = useSelector(state => state.language);
  const profile = useSelector(state => state.auth.profile);
  const translate = getTranslate(localize);
  const [formFields, setFormFields] = useState({
    health_condition_value: ''
  });
  const [language, setLanguage] = useState('');
  const isEditableLanguage = useEditableLanguage(language);
  const [errorHealthConditionValue, setErrorHealthConditionValue] = useState(false);

  useEffect(() => {
    if (languages.length) {
      if (editId && profile && profile.language_id) {
        setLanguage(profile.language_id);
      } else {
        setLanguage(languages[0].id);
      }
    }
  }, [languages, profile, editId]);

  useEffect(() => {
    if (editId && language) {
      dispatch(getHealthCondition(editId, language));
    }
  }, [editId, language, dispatch]);

  useEffect(() => {
    if (editId && healthCondition) {
      setFormFields({ ...formFields, health_condition_value: healthCondition.title });
    }
    // eslint-disable-next-line
  }, [editId, healthCondition]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.health_condition_value === '') {
      canSave = false;
      setErrorHealthConditionValue(true);
    } else {
      setErrorHealthConditionValue(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateHealthCondition(editId, { ...formFields, lang: language, health_condition_group: activeHealthConditionGroup.id }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      } else {
        dispatch(createHealthCondition({ ...formFields, lang: language, health_condition_group: activeHealthConditionGroup.id }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      }
    }
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'setting.health_condition.edit' : 'setting.health_condition.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
      disabled={!isEditableLanguage}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="formLanguage">
          <Form.Label>{translate('common.show_language.version')}</Form.Label>
          <Select
            isDisabled={!editId}
            classNamePrefix="filter"
            value={languages.filter(option => option.id === language)}
            getOptionLabel={option => `${option.name} ${option.code === option.fallback ? translate('common.default') : ''}`}
            options={languages}
            onChange={(e) => handleLanguageChange(e.id)}
            styles={customSelectStyles}
            aria-label={translate('common.show_language.version')}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>{translate('setting.health_condition_group.title')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            disabled
            type="text"
            name="health_condition_group"
            placeholder={translate('placeholder.enter_health_condition_group_name')}
            value={activeHealthConditionGroup.title}
            aria-label={translate('placeholder.enter_health_condition_group_name')}
          />
        </Form.Group>
        <Form.Group>
          {editId ? (
            <>
              <Form.Label>{translate('setting.health_condition.title')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                type="text"
                name="health_condition_value"
                placeholder={translate('placeholder.enter_health_condition_title')}
                isInvalid={errorHealthConditionValue}
                value={formFields.health_condition_value}
                onChange={handleChange}
                maxLength={settings.textMaxLength}
                aria-label={translate('placeholder.enter_health_condition_title')}
                disabled={!isEditableLanguage}
              />
              <Form.Control.Feedback type="invalid">
                {translate('error.health_condition_title')}
              </Form.Control.Feedback>
            </>
          ) : (
            <>
              <Form.Label>{translate('setting.health_condition.health_condition_value')}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                type="text"
                name="health_condition_value"
                placeholder={translate('placeholder.enter_health_condition_value')}
                isInvalid={errorHealthConditionValue}
                value={formFields.health_condition_value}
                onChange={handleChange}
                aria-label={translate('placeholder.enter_health_condition_value')}
                disabled={!isEditableLanguage}
              />
              <Form.Text className="text-muted">
                {translate('setting.health_condition_group.health_condition_value_hint')}
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {translate('error.health_condition_value')}
              </Form.Control.Feedback>
            </>
          )}
        </Form.Group>
      </Form>
      {editId && healthCondition.auto_translated === true && (
        <GoogleTranslationAttribute />
      )}
    </Dialog>
  );
};

CreateHealthCondition.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.number,
  activeHealthConditionGroup: PropTypes.number
};

export default CreateHealthCondition;

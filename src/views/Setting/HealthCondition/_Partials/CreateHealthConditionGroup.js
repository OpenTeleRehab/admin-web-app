import React, { useState, useEffect } from 'react';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Form } from 'react-bootstrap';
import { createHealthConditionGroup, updateHealthConditionGroup, getHealthConditionGroup } from 'store/healthConditionGroup/actions';
import PropTypes from 'prop-types';
import settings from 'settings';
import Select from 'react-select';
import scssColors from '../../../../scss/custom.scss';
import GoogleTranslationAttribute from '../../../../components/GoogleTranslationAttribute';

const CreateHealthConditionGroup = ({ show, handleClose, editId }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const { healthConditionGroup } = useSelector((state) => state.healthConditionGroup);
  const { languages } = useSelector(state => state.language);
  const profile = useSelector(state => state.auth.profile);
  const translate = getTranslate(localize);
  const [formFields, setFormFields] = useState({
    health_condition_group: '',
    current_health_condition_group: '',
    health_condition_value: ''
  });
  const [language, setLanguage] = useState('');

  const [errorHealthConditionGroup, setErrorHealthConditionGroup] = useState(false);
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
      dispatch(getHealthConditionGroup(editId, language));
    }
  }, [editId, language, dispatch]);

  useEffect(() => {
    if (editId && healthConditionGroup) {
      setFormFields({ ...formFields, health_condition_group: healthConditionGroup.title });
    }
    // eslint-disable-next-line
  }, [editId, healthConditionGroup]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.health_condition_group === '') {
      canSave = false;
      setErrorHealthConditionGroup(true);
    } else {
      setErrorHealthConditionGroup(false);
    }

    if (formFields.health_condition_value === '' && !editId) {
      canSave = false;
      setErrorHealthConditionValue(true);
    } else {
      setErrorHealthConditionValue(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateHealthConditionGroup(editId, { ...formFields, lang: language }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      } else {
        dispatch(createHealthConditionGroup({ ...formFields, lang: language }))
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
      title={translate(editId ? 'setting.health_condition_group.edit' : 'setting.health_condition_group.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
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
            type="text"
            name="health_condition_group"
            placeholder={translate('placeholder.enter_health_condition_group_name')}
            isInvalid={errorHealthConditionGroup}
            value={formFields.health_condition_group}
            onChange={handleChange}
            maxLength={settings.textMaxLength}
            aria-label={translate('placeholder.enter_health_condition_group_name')}
          />
          <Form.Control.Feedback type="invalid">
            {translate(errorHealthConditionGroup ? 'error.health_condition_group' : '')}
          </Form.Control.Feedback>
        </Form.Group>
        {!editId &&
          <Form.Group>
            <Form.Label>{translate('setting.health_condition_group.health_condition_value')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              type="text"
              name="health_condition_value"
              placeholder={translate('placeholder.enter_health_condition_value')}
              isInvalid={errorHealthConditionValue}
              value={formFields.health_condition_value_value}
              onChange={handleChange}
              aria-label={translate('placeholder.enter_health_condition_value')}
            />
            <Form.Text className="text-muted">
              {translate('setting.health_condition_group.health_condition_value_hint')}
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {translate('error.health_condition_value')}
            </Form.Control.Feedback>
          </Form.Group>
        }
      </Form>
      {editId && healthConditionGroup.auto_translated === true && (
        <GoogleTranslationAttribute />
      )}
    </Dialog>
  );
};

CreateHealthConditionGroup.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  editId: PropTypes.number,
  activeCategory: PropTypes.number
};

export default CreateHealthConditionGroup;

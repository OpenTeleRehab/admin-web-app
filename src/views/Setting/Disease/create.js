import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { createDisease, updateDisease, getDisease } from 'store/disease/actions';
import settings from 'settings';

const CreateDisease = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  const { disease, filters } = useSelector(state => state.disease);
  const { languages } = useSelector(state => state.language);
  const [errorName, setErrorName] = useState(false);
  const [language, setLanguage] = useState('');

  const [formFields, setFormFields] = useState({
    name: ''
  });

  useEffect(() => {
    if (languages.length) {
      if (editId) {
        if (filters && filters.lang) {
          setLanguage(filters.lang);
        } else if (profile && profile.language_id) {
          setLanguage(profile.language_id);
        } else {
          setLanguage(languages[0].id);
        }
      } else {
        setLanguage(languages[0].id);
      }
    }
  }, [languages, filters, editId, profile]);

  useEffect(() => {
    if (editId && language) {
      dispatch(getDisease(editId, language));
    }
  }, [editId, language, dispatch]);

  useEffect(() => {
    if (editId && disease.id) {
      setFormFields({
        name: disease.name
      });
    } else {
      setFormFields({
        ...formFields
      });
    }
    // eslint-disable-next-line
  }, [editId, disease, profile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateDisease(editId, { ...formFields, lang: language })).then(result => {
          if (result) {
            handleClose();
          }
        });
      } else {
        dispatch(createDisease({ ...formFields, lang: language })).then(result => {
          if (result) {
            handleClose();
          }
        });
      }
    }
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'disease.edit' : 'disease.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="formLanguage">
          <Form.Label>{translate('common.show_language.version')}</Form.Label>
          <Form.Control as="select" value={editId ? language : ''} onChange={handleLanguageChange} disabled={!editId}>
            {languages.map((language, index) => (
              <option key={index} value={language.id}>
                {language.name} {language.code === language.fallback && `(${translate('common.default')})`}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>{translate('disease.name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="name"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.disease.name')}
              isInvalid={errorName}
              value={formFields.name}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.disease.name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

CreateDisease.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateDisease;

import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { createLanguage, updateLanguage } from 'store/language/actions';
import settings from 'settings';

const CreateLanguage = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const languages = useSelector(state => state.language.languages);
  const [errorName, setErrorName] = useState(false);
  const [errorCode, setErrorCode] = useState(false);

  const [formFields, setFormFields] = useState({
    name: '',
    code: '',
    rtl: false
  });

  useEffect(() => {
    if (editId && languages.length) {
      const language = languages.find(language => language.id === editId);
      setFormFields({
        name: language.name,
        code: language.code,
        rtl: language.rtl
      });
    }
  }, [editId, languages]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (formFields.code === '' || formFields.code.length !== settings.isoCodeLength) {
      canSave = false;
      setErrorCode(true);
    } else {
      setErrorCode(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateLanguage(editId, formFields)).then(result => {
          if (result) {
            handleClose();
          }
        });
      } else {
        dispatch(createLanguage(formFields)).then(result => {
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

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'language.edit' : 'language.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>{translate('language.name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="name"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.language.name')}
              isInvalid={errorName}
              value={formFields.name}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.language.name')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="code">
            <Form.Label>{translate('language.code')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="code"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.language.code')}
              isInvalid={errorCode}
              value={formFields.code}
            />
            <Form.Control.Feedback type="invalid">
              { errorCode && formFields.code === '' ? translate('error.language.code') : translate('error.language.code.format') }
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="rtl">
            <Form.Check
              name="rtl"
              onChange={handleCheck}
              value={true}
              checked={formFields.rtl}
              label={translate('language.rtl')}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

CreateLanguage.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateLanguage;

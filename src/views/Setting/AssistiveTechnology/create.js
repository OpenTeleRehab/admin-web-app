import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import {
  createAssistiveTechnology,
  getAssistiveTechnology,
  updateAssistiveTechnology
} from 'store/assistiveTechnology/actions';
import { formatFileSize } from '../../../utils/file';
import settings from 'settings';

const CreateAssistiveTechnology = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { assistiveTechnology } = useSelector(state => state.assistiveTechnology);
  const { languages } = useSelector(state => state.language);
  const [language, setLanguage] = useState('');
  const [file, setFile] = useState(undefined);
  const [errorCode, setErrorCode] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorFile, setErrorFile] = useState(false);

  const [formFields, setFormFields] = useState({
    code: '',
    name: '',
    description: '',
    file: undefined
  });

  useEffect(() => {
    if (languages.length) {
      if (editId) {
        if (profile && profile.language_id) {
          setLanguage(profile.language_id);
        } else {
          setLanguage(languages[0].id);
        }
      } else {
        setLanguage(languages[0].id);
      }
    }
  }, [languages, editId, profile]);

  useEffect(() => {
    if (editId && language) {
      dispatch(getAssistiveTechnology(editId, language));
    }
  }, [editId, language, dispatch]);

  useEffect(() => {
    if (editId && assistiveTechnology.id) {
      setFormFields({
        code: assistiveTechnology.code,
        name: assistiveTechnology.name,
        description: assistiveTechnology.description
      });
      setFile(assistiveTechnology.file);
    } else {
      setFormFields({
        ...formFields
      });
    }
  }, [editId, assistiveTechnology, formFields]);

  const renderUploadFileName = () => {
    const file = formFields.file;

    if (file) {
      return `${file.name} (${formatFileSize(file.size)})`;
    }

    return translate('assistive_technology.upload_file.placeholder');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.code === '') {
      canSave = false;
      setErrorCode(true);
    } else {
      setErrorCode(false);
    }

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (!file && formFields.file === undefined) {
      canSave = false;
      setErrorFile(true);
    } else {
      setErrorFile(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateAssistiveTechnology(editId, { ...formFields, lang: language })).then(result => {
          if (result) {
            handleClose();
          }
        });
      } else {
        dispatch(createAssistiveTechnology({ ...formFields, lang: language })).then(result => {
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormFields({ ...formFields, [name]: files[0] });
  };

  const handleFileUpload = (e) => {
    if (e.key === 'Enter') {
      document.getElementById('file').click();
      e.stopPropagation();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'assistive_technology.edit' : 'assistive_technology.new')}
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
          <Form.Group as={Col} controlId="code">
            <Form.Label>{translate('assistive_technology.code')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="code"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.assistive_technology.code')}
              isInvalid={errorCode}
              value={formFields.code}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.assistive_technology.code')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="name">
            <Form.Label>{translate('assistive_technology.name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="name"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.assistive_technology.name')}
              isInvalid={errorName}
              value={formFields.name}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.assistive_technology.name')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>{translate('assistive_technology.upload_file')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.File custom>
              <Form.File.Input
                name="file"
                onChange={handleFileChange}
                isInvalid={errorFile}
                accept="image/*"
                aria-label="Upload File"
                id="file"
                onKeyPress={(event) => handleFileUpload(event)}
              />
              <Form.File.Label>{renderUploadFileName()}</Form.File.Label>
              {formFields.file === undefined &&
                <Form.Control.Feedback type="invalid">
                  {translate('education_material.upload_file.required')}
                </Form.Control.Feedback>
              }
              {file &&
                <Form.Text className="text-muted">
                  <a
                    className="pl-2"
                    href={`${process.env.REACT_APP_API_BASE_URL}/file/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.fileName}
                  </a>
                </Form.Text>
              }
            </Form.File>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="description">
            <Form.Label>{translate('assistive_technology.description')}</Form.Label>
            <Form.Control
              name="description"
              value={formFields.description}
              onChange={handleChange}
              as="textarea"
              rows={3}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </Dialog>
  );
};

CreateAssistiveTechnology.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateAssistiveTechnology;

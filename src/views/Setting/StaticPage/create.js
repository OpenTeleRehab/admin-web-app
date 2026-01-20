import React, { useEffect, useState } from 'react';
import {
  Form,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import settings from 'settings';
import { createStaticPage, getStaticPage, updateStaticPage } from 'store/staticPage/actions';
import { toMB } from '../../../utils/file';
import { BsUpload, BsXCircle } from 'react-icons/bs';
import { Editor } from '@tinymce/tinymce-react';

import { SketchPicker } from 'react-color';
import Select from 'react-select';
import { File } from '../../../services/file';
import scssColors from '../../../scss/custom.scss';
import { USER_GROUPS, USER_ROLES } from '../../../variables/user';
import GoogleTranslationAttribute from '../../../components/GoogleTranslationAttribute';
import { useEditableLanguage } from 'hooks/useEditableLanguage';
import keycloak from '../../../utils/keycloak';

const CreateStaticPage = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { maxFileSize } = settings.educationMaterial;

  const [errorContent, setErrorContent] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorPlatform, setErrorPlatform] = useState(false);
  const [errorUrl, setErrorUrl] = useState(false);
  const [materialFile, setMaterialFile] = useState(undefined);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);

  const { staticPage, filters } = useSelector(state => state.staticPage);

  const [language, setLanguage] = useState('');
  const isEditableLanguage = useEditableLanguage(language);
  const [formFields, setFormFields] = useState({
    platform: '',
    url: '',
    private: false,
    title: '',
    background_color: '#fff',
    text_color: '#000',
    file: undefined
  });
  const [content, setContent] = useState('');

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
      dispatch(getStaticPage(editId, language));
    }
  }, [editId, language, dispatch]);

  useEffect(() => {
    if (editId && staticPage.id) {
      setFormFields({
        title: staticPage.title || '',
        platform: staticPage.platform || '',
        url: staticPage.url || '',
        private: staticPage.private || '',
        background_color: staticPage.background_color || '',
        text_color: staticPage.text_color || ''
      });
      setMaterialFile(staticPage.file);
      setContent(staticPage.content || '');
    }
  }, [editId, staticPage]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value });
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormFields({ ...formFields, [name]: files[0] });

    const file = files[0];
    if (file) {
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(2);
      const fileType = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setMaterialFile({ url: reader.result, fileName, fileSize, fileType, file });
      };
    }
  };

  const handleUrlChange = (e) => {
    const { name, value } = e.target;
    const val = value.replace(/\s+/g, '-').toLowerCase();
    setFormFields({ ...formFields, [name]: val });
  };

  const handleFileRemove = (e) => {
    setMaterialFile(null);
    setFormFields({ ...formFields, file: undefined });
  };

  const handleEditorChange = (value, editor) => {
    setContent(value);
  };

  const handleBackgroundColorChange = (color, editor) => {
    setFormFields({ ...formFields, background_color: color.hex });
  };

  const handleTextColorChange = (color, editor) => {
    setFormFields({ ...formFields, text_color: color.hex });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.title === '') {
      canSave = false;
      setErrorTitle(true);
    } else {
      setErrorTitle(false);
    }

    if (formFields.platform === '') {
      canSave = false;
      setErrorPlatform(true);
    } else {
      setErrorPlatform(false);
    }

    if (formFields.url === '') {
      canSave = false;
      setErrorUrl(true);
    } else {
      setErrorUrl(false);
    }

    if (formFields.content === '') {
      canSave = false;
      setErrorContent(true);
    } else {
      setErrorContent(false);
    }

    if (formFields.file !== undefined && toMB(formFields.file.size) > maxFileSize) {
      canSave = false;
    }

    if (canSave) {
      if (editId) {
        dispatch(updateStaticPage(editId, { ...formFields, content, lang: language }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      } else {
        dispatch(createStaticPage({ ...formFields, content, lang: language }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      }
    }
  };

  const platformOptions = [
    {
      value: '',
      text: translate('placeholder.platform')
    },
    ...settings.platforms.options
  ];

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
      enforceFocus={false}
      size="lg"
      show={show}
      title={translate(editId ? 'static_page.edit' : 'static_page.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      disabled={!isEditableLanguage}
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
            aria-label="Language"
          />
        </Form.Group>
        <Form.Group controlId="formPrivate">
          <Form.Check
            name="private"
            onChange={handleCheck}
            value={true}
            checked={formFields.private}
            label={translate('static_page.private')}
          />
        </Form.Group>
        <Form.Group controlId="formPlateForm">
          <Form.Label>{translate('setting.translations.platform')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Select
            isDisabled={!keycloak.hasRealmRole(USER_ROLES.MANAGE_STATIC_PAGE)}
            placeholder={translate('placeholder.platform')}
            classNamePrefix="filter"
            className={errorPlatform ? 'is-invalid' : ''}
            value={settings.platforms.options.filter(option => option.value === formFields.platform)}
            getOptionLabel={option => option.text}
            options={platformOptions}
            onChange={(e) => handleSingleSelectChange('platform', e.value)}
            styles={customSelectStyles}
            aria-label="Platform"
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.static_page.platform')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="url">
          <Form.Label>{translate('static_page.url')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">/</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              name="url"
              placeholder={translate('placeholder.static_page.url')}
              onChange={handleUrlChange}
              value={formFields.url}
              maxLength={settings.textMaxLength}
              isInvalid={errorUrl}
              disabled={!keycloak.hasRealmRole(USER_ROLES.MANAGE_STATIC_PAGE)}
            />

            <Form.Control.Feedback type="invalid">
              {translate('error.static_page.url')}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="formFile">
          <Form.Label>{translate('static_page.image')}</Form.Label>
          <Form.Control.Feedback type="invalid">
            {formFields.file !== undefined
              ? translate('education_material.upload_file.max_size', { size: maxFileSize }) : ''
            }
          </Form.Control.Feedback>

          <div className="w-50">
            {materialFile && (
              <div className="exercise-media">
                <div className="mb-2 position-relative">
                  <div className="position-absolute remove-btn-wrapper">
                    <BsXCircle size={20} onClick={handleFileRemove}/>
                  </div>
                  <img src={materialFile.url || `${process.env.REACT_APP_API_BASE_URL}/file/${materialFile.id}`} alt="..." className="w-100 img-thumbnail"/>
                  <div>{materialFile.fileName} {materialFile.fileSize ? ('(' + materialFile.fileSize + 'kB )') : ''}</div>
                </div>
              </div>
            )}
            <div className="btn btn-sm bg-white btn-outline-primary text-primary position-relative overflow-hidden" >
              <BsUpload size={15}/> {translate('static_page.media_upload')}
              <input type="file" name="file" className="position-absolute upload-btn" onChange={handleFileChange} accept="image/*" aria-label="Upload" />
            </div>
          </div>
        </Form.Group>
        <Form.Group controlId="title">
          <Form.Label>{translate('static_page.title')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="title"
            onChange={handleChange}
            type="text"
            placeholder={translate('placeholder.static_page.title')}
            value={formFields.title}
            maxLength={settings.textMaxLength}
            isInvalid={errorTitle}
            disabled={!isEditableLanguage}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.static_page.title')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Row>
          <Form.Group controlId="background-color" className="col-md-6">
            <Form.Label>{translate('static_page.background_color')}</Form.Label>
            <SketchPicker
              onChange={handleBackgroundColorChange}
              color={formFields.background_color}
            />
          </Form.Group>
          <Form.Group controlId="text-color" className="col-md-6">
            <Form.Label>{translate('static_page.text_color')}</Form.Label>
            <SketchPicker
              onChange={handleTextColorChange}
              color={formFields.text_color}
            />
          </Form.Group>
        </Form.Row>
        <Form.Group controlId="content">
          <Form.Label>{translate('term_and_condition.content')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Editor
            key={language}
            apiKey={settings.tinymce.apiKey}
            name="content"
            isInvalid={errorContent}
            value={content}
            init={{
              image_title: true,
              automatic_uploads: true,
              file_picker_types: 'image',
              file_picker_callback: (cb, value, meta) => {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = function () {
                  var file = this.files[0];
                  var reader = new FileReader();
                  reader.onload = async () => {
                    const base64 = reader.result;
                    const fileUpload = {
                      url: base64,
                      fileName: file.name,
                      fileSize: file.size,
                      fileType: file.type
                    };
                    const data = await File.upload(fileUpload);
                    if (data.success) {
                      const file = data.data;
                      const path = process.env.REACT_APP_API_BASE_URL + '/file/' + file.id;
                      cb(path, { title: file.filename });
                    }
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              },
              height: settings.tinymce.height,
              plugins: settings.tinymce.plugins,
              content_style: settings.tinymce.contentStyle,
              toolbar: settings.tinymce.toolbar
            }}
            onEditorChange={handleEditorChange}
            disabled={!isEditableLanguage}
          />
          {errorContent &&
            <div className="invalid-feedback d-block">{translate('error.term_and_condition.content')}</div>
          }
        </Form.Group>
        { editId && staticPage.auto_translated === true && (
          <GoogleTranslationAttribute />
        )}
      </Form>
    </Dialog>
  );
};

CreateStaticPage.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateStaticPage;

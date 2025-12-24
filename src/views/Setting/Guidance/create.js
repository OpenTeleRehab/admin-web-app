import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import settings from 'settings';
import { createGuidancePage, getGuidancePage, updateGuidancePage } from 'store/guidancePage/actions';
import { Editor } from '@tinymce/tinymce-react';
import { File } from '../../../services/file';
import GoogleTranslationAttribute from '../../../components/GoogleTranslationAttribute';

const CreateGuidancePage = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const [errorContent, setErrorContent] = useState(false);
  const { languages } = useSelector(state => state.language);
  const { profile } = useSelector((state) => state.auth);
  const { guidancePage, filters } = useSelector(state => state.guidancePage);
  const [errorTitle, setErrorTitle] = useState(false);

  const [language, setLanguage] = useState('');
  const [content, setContent] = useState('');
  const [formFields, setFormFields] = useState({
    target_role: 'therapist',
    title: ''
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
      dispatch(getGuidancePage(editId, language));
    }
  }, [editId, language, dispatch]);

  useEffect(() => {
    if (editId && guidancePage.id) {
      setFormFields({ title: guidancePage.title || '' });
      setContent(guidancePage.content || '');
    }
  }, [editId, guidancePage]);

  const handleLanguageChange = e => {
    const { value } = e.target;
    setLanguage(value);
  };

  const handleEditorChange = (value, editor) => {
    setContent(value);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.title === '') {
      canSave = false;
      setErrorTitle(true);
    } else {
      setErrorTitle(false);
    }

    if (content === '') {
      canSave = false;
      setErrorContent(true);
    } else {
      setErrorContent(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateGuidancePage(editId, { ...formFields, content, lang: language }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      } else {
        dispatch(createGuidancePage({ ...formFields, content, lang: language }))
          .then(result => {
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
      enforceFocus={false}
      size="lg"
      show={show}
      title={translate(editId ? 'guidance_page.edit' : 'guidance_page.new')}
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
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.static_page.title')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="content">
          <Form.Label>{translate('term_and_condition.content')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Editor
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
          />
          {errorContent &&
            <div className="invalid-feedback d-block">{translate('error.term_and_condition.content')}</div>
          }
        </Form.Group>
      </Form>
      { editId && guidancePage.auto_translated === true && (
        <GoogleTranslationAttribute />
      )}
    </Dialog>
  );
};

CreateGuidancePage.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateGuidancePage;

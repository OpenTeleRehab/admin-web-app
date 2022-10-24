import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import settings from 'settings';
import {
  createTermAndCondition,
  getTermAndCondition,
  updateTermAndCondition
} from 'store/termAndCondition/actions';
import Select from 'react-select';
import { File } from '../../../services/file';
import scssColors from '../../../scss/custom.scss';
import GoogleTranslationAttribute from '../../../components/GoogleTranslationAttribute';

const CreateTermAndCondition = ({ show, editId = null, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const [errorContent, setErrorContent] = useState(false);
  const [errorClass, setErrorClass] = useState('');
  const [errorContentMessage, setErrorContentMessage] = useState('');
  const [errorVersion, setVersion] = useState(false);
  const { languages } = useSelector(state => state.language);
  const { termAndCondition } = useSelector(state => state.termAndCondition);
  const { profile } = useSelector((state) => state.auth);

  const [language, setLanguage] = useState();
  const [formFields, setFormFields] = useState({
    version: ''
  });

  const [content, setContent] = useState('');

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
  }, [languages, profile, editId]);

  useEffect(() => {
    if (editId && language) {
      dispatch(getTermAndCondition(editId, language));
    }
  }, [editId, language, dispatch]);

  useEffect(() => {
    if (editId && termAndCondition.id) {
      setFormFields({
        version: termAndCondition.version
      });
      setContent(termAndCondition.content);
    }
  }, [editId, termAndCondition]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.version === '') {
      canSave = false;
      setVersion(true);
    } else {
      setVersion(false);
    }

    if (content === '') {
      canSave = false;
      setErrorContent(true);
      setErrorContentMessage(translate('error.term_and_condition.content'));
      setErrorClass('error-feedback');
    } else {
      setErrorContent(false);
    }

    if (canSave) {
      if (editId) {
        dispatch(updateTermAndCondition(editId, { ...formFields, content, lang: language }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      } else {
        dispatch(createTermAndCondition({ ...formFields, content, lang: language }))
          .then(result => {
            if (result) {
              handleClose();
            }
          });
      }
    }
  };

  const handleEditorChange = (value, editor) => {
    setContent(value);
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

  const isPublished = termAndCondition !== null && termAndCondition.published_date !== null;
  const isAutoTranslated = termAndCondition !== null && termAndCondition.auto_translated;

  return (
    <Dialog
      enforceFocus={false}
      size="lg"
      show={show}
      title={translate(editId ? 'term_and_condition.edit' : 'term_and_condition.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
      disabled={editId && isPublished && !isAutoTranslated}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="formLanguage">
          <Form.Label>{translate('common.show_language.version')} {language}</Form.Label>
          <Select
            isDisabled={!editId}
            classNamePrefix="filter"
            value={languages.filter(option => option.id === language)}
            getOptionLabel={option => `${option.name} ${option.code === option.fallback ? translate('common.default') : ''}`}
            options={languages}
            onChange={(e) => setLanguage(e.id)}
            styles={customSelectStyles}
            aria-label="Language"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>{translate('term_and_condition.version')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            aria-label="Version"
            name="version"
            onChange={handleChange}
            type="text"
            placeholder={translate('placeholder.term_and_condition.version')}
            isInvalid={errorVersion}
            value={formFields.version}
            maxLength={settings.textMaxLength}
            disabled={editId && isPublished}
          />
          <Form.Control.Feedback type="invalid">
            {translate('error.term_and_condition.version')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="version">
          <Form.Label>Content</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Editor
            apiKey={settings.tinymce.apiKey}
            name="content"
            value={content}
            isInvalid={errorContent}
            initialValue="<p>This is the initial content of the editor</p>"
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
          <span className={errorClass}>{ errorContentMessage }</span>
        </Form.Group>
      </Form>
      { editId && isAutoTranslated && (
        <GoogleTranslationAttribute />
      )}
    </Dialog>
  );
};

CreateTermAndCondition.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateTermAndCondition;

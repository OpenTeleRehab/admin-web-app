import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import {
  createSurvey,
  getSurvey,
  updateSurvey
} from 'store/survey/actions';
import settings from 'settings';
import Select from 'react-select';
import { SURVEY_ROLES, SURVEY_LOCATION } from 'variables/survey';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import Questionnaire from './Partials/Questionnaire';
import { USER_GROUPS } from 'variables/user';

const CreateSurvey = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const organizations = useSelector((state) => state.organization.organizations);
  const { survey } = useSelector(state => state.survey);

  const { languages } = useSelector(state => state.language);
  const [errorInvalidStartDate, setErrorInvalidStartDate] = useState(false);
  const [errorInvalidEndDate, setErrorInvalidEndDate] = useState(false);
  const [errorEndDateBeforeStartDate, setErrorEndDateBeforeStartDate] = useState(false);
  const [errorOrganization, setErrorOrganization] = useState(false);
  const [errorRole, setErrorRole] = useState(false);
  const [errorCountry, setErrorCountry] = useState(false);
  const [errorClinic, setErrorClinic] = useState(false);
  const [errorLocation, setErrorLocation] = useState(false);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorFrequency, setErrorFrequency] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [locale, setLocale] = useState('en-us');
  const [formFields, setFormFields] = useState({
    organization: [],
    role: '',
    country: [],
    location: [],
    clinic: [],
    frequency: ''
  });
  const [errorInclude, setErrorinclude] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [questionTitleError, setQuestionTitleError] = useState([]);
  const [answerFieldError, setAnswerFieldError] = useState([]);
  const [answerValueError, setAnswerValueError] = useState([]);
  const [answerThresholdError, setAnswerThresholdError] = useState([]);
  const [questionnaire, setQuestionnaire] = useState({ title: '', questions: [] });
  const [questionnaireId, setQuestionnaireId] = useState();
  const [language, setLanguage] = useState('');
  const organizationOptions = organizations.map(item => ({
    value: item.id,
    label: item.name
  }));
  const countryOptions = countries.map(item => ({
    value: item.id,
    label: item.name
  }));
  const clinicOptions = clinics.filter(item => formFields.country.includes(item.country_id))
    .map(item => ({
      value: item.id,
      label: item.name
    }));

  useEffect(() => {
    if (languages.length && profile) {
      const language = languages.find(lang => lang.id === profile.language_id);
      if (language) {
        setLocale(language.code);
      } else {
        setLocale('en-us');
      }
    }
  }, [languages, profile]);

  useEffect(() => {
    if (editId) {
      dispatch(getSurvey(editId));
    }
  }, [editId, dispatch]);

  useEffect(() => {
    if (editId && survey.id) {
      setFormFields({
        organization: survey.organization,
        role: survey.role,
        country: survey.country,
        location: survey.location,
        clinic: survey.clinic,
        include_at_the_end: survey.include_at_the_end,
        include_at_the_start: survey.include_at_the_start,
        frequency: survey.frequency,
        start_date: survey.start_date ? moment(survey.start_date, 'YYYY-MM-DD').format(settings.date_format) : '',
        end_date: survey.end_date ? moment(survey.end_date, 'YYYY-MM-DD').format(settings.date_format) : ''
      });
      setQuestionnaireId(survey.questionnaire_id);
      setStartDate(survey.start_date ? moment(survey.start_date, 'YYYY-MM-DD').format(settings.date_format) : '');
      setEndDate(survey.end_date ? moment(survey.end_date, 'YYYY-MM-DD').format(settings.date_format) : '');
    }
  }, [editId, survey]);

  useEffect(() => {
    if (startDate) {
      if (moment(startDate, settings.date_format, true).isValid()) {
        const date = moment(startDate, settings.date_format).locale('en').format(settings.date_format);
        setFormFields({ ...formFields, start_date: date, include_at_the_start: false, include_at_the_end: false });
        setErrorInvalidStartDate(false);
      } else {
        setErrorInvalidStartDate(true);
        setFormFields({ ...formFields, start_date: '' });
      }
    } else {
      setErrorInvalidStartDate(false);
      setFormFields({ ...formFields, start_date: '' });
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      if (moment(endDate, settings.date_format, true).isValid()) {
        const date = moment(endDate, settings.date_format).locale('en').format(settings.date_format);
        setFormFields({ ...formFields, end_date: date });
        setErrorInvalidEndDate(false);
      } else {
        setErrorInvalidEndDate(true);
        setFormFields({ ...formFields, end_date: '' });
      }
    } else {
      setErrorInvalidEndDate(false);
      setFormFields({ ...formFields, end_date: '' });
    }
  }, [endDate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleConfirm = () => {
    let canSave = true;
    const errorQuestionTitle = [];
    const errorAnswerField = [];
    const errorAnswerValue = [];
    const errorAnswerThreshold = [];

    if (formFields.organization.length === 0) {
      canSave = false;
      setErrorOrganization(true);
    } else {
      setErrorOrganization(false);
    }

    if (formFields.role.length === 0) {
      canSave = false;
      setErrorRole(true);
    } else {
      setErrorRole(false);
    }

    if (formFields.role !== USER_GROUPS.ORGANIZATION_ADMIN && formFields.country.length === 0) {
      canSave = false;
      setErrorCountry(true);
    } else {
      setErrorCountry(false);
    }

    if (formFields.role !== USER_GROUPS.ORGANIZATION_ADMIN && formFields.role !== USER_GROUPS.COUNTRY_ADMIN && formFields.clinic.length === 0) {
      canSave = false;
      setErrorClinic(true);
    } else {
      setErrorClinic(false);
    }

    if (formFields.role !== USER_GROUPS.PATIENT && formFields.start_date === '') {
      canSave = false;
      setErrorStartDate(true);
    } else {
      setErrorStartDate(false);
    }

    if (formFields.role !== USER_GROUPS.PATIENT && formFields.end_date === '') {
      canSave = false;
      setErrorEndDate(true);
    } else {
      setErrorEndDate(false);
    }

    if (moment(formFields.end_date, settings.date_format).isBefore(moment(formFields.start_date, settings.date_format))) {
      canSave = false;
      setErrorEndDateBeforeStartDate(true);
    } else {
      setErrorEndDateBeforeStartDate(false);
    }

    if (formFields.role === USER_GROUPS.PATIENT && formFields.start_date === '' && formFields.end_date === '' && !formFields.include_at_the_end && !formFields.include_at_the_start) {
      canSave = false;
      setErrorinclude(true);
    } else {
      setErrorinclude(false);
    }

    if (formFields.role === USER_GROUPS.PATIENT && !formFields.include_at_the_end && !formFields.include_at_the_start) {
      if (formFields.start_date === '') {
        canSave = false;
        setErrorStartDate(true);
      } else {
        setErrorStartDate(false);
      }

      if (formFields.end_date === '') {
        canSave = false;
        setErrorEndDate(true);
      } else {
        setErrorEndDate(false);
      }
    }

    if (formFields.role === USER_GROUPS.PATIENT && formFields.location.length === 0) {
      canSave = false;
      setErrorLocation(true);
    } else {
      setErrorLocation(false);
    }

    if (formFields.frequency === '') {
      canSave = false;
      setErrorFrequency(true);
    } else {
      setErrorFrequency(false);
    }

    if (questionnaire.title === '') {
      canSave = false;
      setTitleError(true);
    } else {
      setTitleError(false);
    }

    for (let i = 0; i < questionnaire.questions.length; i++) {
      if (questionnaire.questions[i].title === '') {
        canSave = false;
        errorQuestionTitle.push(true);
      } else {
        errorQuestionTitle.push(false);
      }
    }

    for (let i = 0; i < questionnaire.questions.length; i++) {
      errorAnswerField.push([]);
      errorAnswerValue.push([]);
      errorAnswerThreshold.push([]);
      for (let j = 0; j < questionnaire.questions[i].answers.length; j++) {
        if (questionnaire.questions[i].type !== 'open-number' && questionnaire.questions[i].answers[j].description === '') {
          canSave = false;
          errorAnswerField[i].push(true);
        } else {
          errorAnswerField[i].push(false);
        }

        if (questionnaire.questions[i].answers[j].value === '') {
          canSave = false;
          errorAnswerValue[i].push(true);
        } else {
          errorAnswerValue[i].push(false);
        }

        if (questionnaire.questions[i].answers[j].threshold === '') {
          canSave = false;
          errorAnswerThreshold[i].push(true);
        } else {
          errorAnswerThreshold[i].push(false);
        }
      }
    }
    setQuestionTitleError(errorQuestionTitle);
    setAnswerFieldError(errorAnswerField);
    setAnswerValueError(errorAnswerValue);
    setAnswerThresholdError(errorAnswerThreshold);

    if (errorInvalidStartDate || errorInvalidEndDate) {
      canSave = false;
    }

    if (canSave) {
      if (editId) {
        dispatch(updateSurvey(editId, { ...formFields, questionnaire: JSON.stringify(questionnaire), lang: language })).then(result => {
          if (result) {
            handleClose();
          }
        });
      } else {
        dispatch(createSurvey({ ...formFields, questionnaire: JSON.stringify({ ...questionnaire, is_survey: true }), lang: language })).then(result => {
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

  const handleRoleChange = (key, value) => {
    setFormFields({
      ...formFields,
      [key]: value,
      start_date: '',
      end_date: '',
      location: [],
      country: [],
      clinic: [],
      include_at_the_end: false,
      include_at_the_start: false
    });
    setStartDate(null);
    setEndDate(null);
  };

  const handleMultipleSelectChange = (selected, e) => {
    const { name } = e;
    setFormFields(prev => ({
      ...prev,
      [name]: selected.map(option => option.value)
    }));
  };

  const handleCheck = e => {
    const { name, checked } = e.target;
    setFormFields({ ...formFields, [name]: checked, start_date: '', end_date: '' });
    setStartDate(null);
    setEndDate(null);
  };

  const validateNumberInput = (e) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'survey.edit' : 'survey.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
      size="xl"
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group controlId="organization">
          <Form.Label>{translate('survey.organization')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Select
            name="organization"
            options={organizationOptions}
            isMulti
            onChange={handleMultipleSelectChange}
            value={organizationOptions.filter(option => formFields.organization.includes(option.value))}
            placeholder={translate('survey.placeholder.organization')}
            className={errorOrganization ? 'is-invalid' : ''}
            classNamePrefix="select"
            isClearable
            aria-label="organization"
          />
          <Form.Control.Feedback type="invalid">
            {translate('survey.error.oranization')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="role">
          <Form.Label>{translate('survey.role')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Select
            name="role"
            getOptionLabel={option => translate('common.' + option.value)}
            options={SURVEY_ROLES}
            onChange={(e) => handleRoleChange('role', e.value)}
            value={SURVEY_ROLES.filter(option => formFields.role.includes(option.value))}
            placeholder={translate('survey.placeholder.role')}
            className={errorRole ? 'is-invalid' : ''}
            classNamePrefix="select"
            isClearable
            aria-label="role"
          />
          <Form.Control.Feedback type="invalid">
            {translate('survey.error.role')}
          </Form.Control.Feedback>
        </Form.Group>
        {formFields.role && (
          <>
            {formFields.role !== USER_GROUPS.ORGANIZATION_ADMIN && (
              <Form.Group controlId="country">
                <Form.Label>{translate('common.country')}</Form.Label>
                <span className="text-dark ml-1">*</span>
                <Select
                  name="country"
                  options={countryOptions}
                  isMulti
                  onChange={handleMultipleSelectChange}
                  value={countryOptions.filter(option => formFields.country.includes(option.value))}
                  placeholder={translate('placeholder.country')}
                  className={errorCountry ? 'is-invalid' : ''}
                  classNamePrefix="select"
                  isClearable
                  aria-label="country"
                />
                <Form.Control.Feedback type="invalid">
                  {translate('error.country')}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {formFields.role === USER_GROUPS.PATIENT && (
              <Form.Group controlId="location">
                <Form.Label>{translate('survey.location')}</Form.Label>
                <span className="text-dark ml-1">*</span>
                <Select
                  name="location"
                  getOptionLabel={option => translate('common.' + option.value)}
                  options={SURVEY_LOCATION}
                  isMulti
                  onChange={handleMultipleSelectChange}
                  value={SURVEY_LOCATION.filter(option => formFields.location.includes(option.value))}
                  placeholder={translate('survey.placeholder.location')}
                  className={errorLocation ? 'is-invalid' : ''}
                  classNamePrefix="select"
                  isClearable
                  aria-label="location"
                />
                <Form.Control.Feedback type="invalid">
                  {translate('survey.error.location')}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {formFields.role !== USER_GROUPS.ORGANIZATION_ADMIN && formFields.role !== USER_GROUPS.COUNTRY_ADMIN && (
              <Form.Group controlId="clinic">
                <Form.Label>{translate('common.clinic')}</Form.Label>
                <span className="text-dark ml-1">*</span>
                <Select
                  name="clinic"
                  options={clinicOptions}
                  isMulti
                  onChange={handleMultipleSelectChange}
                  value={clinicOptions.filter(option => formFields.clinic.includes(option.value))}
                  placeholder={translate('placeholder.clinic')}
                  className={errorClinic ? 'is-invalid' : ''}
                  classNamePrefix="select"
                  isClearable
                  aria-label="clinic"
                  isDisabled={!formFields.country.length}
                />
                <Form.Control.Feedback type="invalid">
                  {translate('error.clinic')}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Row>
              <Col sm={6} xl={6}>
                <Form.Group controlId="formStartDate">
                  <label htmlFor="start-date">{translate('survey.start_date')}</label>
                  <span className="text-dark ml-1">*</span>
                  <Datetime
                    inputProps={{
                      id: 'start_date',
                      name: 'start_date',
                      autoComplete: 'off',
                      className: errorInvalidStartDate || errorStartDate ? 'form-control is-invalid' : 'form-control',
                      placeholder: translate('survey.placeholder.start_date'),
                      value: startDate ? moment(startDate, settings.date_format).locale('en').format(settings.date_format) : ''
                    }}
                    dateFormat={settings.date_format}
                    timeFormat={false}
                    closeOnSelect={true}
                    value={startDate}
                    onChange={(value) => setStartDate(value)}
                    locale={locale}
                    isValidDate={(current) => current.isAfter(Datetime.moment().subtract(1, 'day'))}
                  />
                  {(errorInvalidStartDate || errorStartDate) && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {translate(errorInvalidStartDate ? 'survey.error.invalid_date' : 'survey.error.start_date')}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col sm={6} xl={6}>
                <Form.Group controlId="formEndDate">
                  <label htmlFor="end-date">{translate('survey.end_date')}</label>
                  <span className="text-dark ml-1">*</span>
                  <Datetime
                    inputProps={{
                      id: 'end_date',
                      name: 'end_date',
                      autoComplete: 'off',
                      className: errorInvalidEndDate || errorEndDate ? 'form-control is-invalid' : 'form-control',
                      placeholder: translate('survey.placeholder.end_date'),
                      disabled: !startDate,
                      value: endDate ? moment(endDate, settings.date_format).locale('en').format(settings.date_format) : ''
                    }}
                    dateFormat={settings.date_format}
                    timeFormat={false}
                    closeOnSelect={true}
                    value={endDate}
                    onChange={(value) => setEndDate(value)}
                    locale={locale}
                    isValidDate={(current) => current.isAfter(Datetime.moment().subtract(1, 'day'))}
                  />
                  {(errorInvalidEndDate || errorEndDate || errorEndDateBeforeStartDate) && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {translate(errorInvalidEndDate ? 'survey.error.invalid_date' : errorEndDateBeforeStartDate ? 'survey.error.end_before_start_date' : 'survey.error.end_date')}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formFrequency">
              <Form.Label>{translate('survey.frequency') + '(' + translate('survey.in_day') + ')'}</Form.Label>
              <span className="text-dark ml-1">*</span>
              <Form.Control
                type="number"
                name="frequency"
                placeholder={translate('survey.placeholder.frequency')}
                aria-label="Frequency"
                value={formFields.frequency}
                onKeyDown={(e) => validateNumberInput(e)}
                onChange={handleChange}
                className={errorFrequency ? 'is-invalid' : ''}
                min={1}
              />
              <Form.Control.Feedback type="invalid">
                {translate('survey.error.frequency')}
              </Form.Control.Feedback>
            </Form.Group>
            {formFields.role === USER_GROUPS.PATIENT && (
              <>
                <Form.Group controlId="formIncludeAtTheStart">
                  <Form.Check
                    name="include_at_the_start"
                    onChange={handleCheck}
                    value={true}
                    checked={formFields.include_at_the_start}
                    label={translate('survey.include_at_the_start')}
                  />
                </Form.Group>
                <Form.Group controlId="formIncludeAtTheEnd" className={errorInclude ? 'mb-0' : ''}>
                  <Form.Check
                    name="include_at_the_end"
                    onChange={handleCheck}
                    value={true}
                    checked={formFields.include_at_the_end}
                    label={translate('survey.include_at_the_end')}
                  />
                </Form.Group>
                {errorInclude && (
                  <Form.Text className="text-danger mb-3">{translate('survey.error.include')}</Form.Text>
                )}
              </>
            )}
          </>
        )}

        <Questionnaire
          titleError={titleError}
          questionTitleError={questionTitleError}
          answerFieldError={answerFieldError}
          answerValueError={answerValueError}
          answerThresholdError={answerThresholdError}
          id={questionnaireId}
          questionnaireData={questionnaire}
          setQuestionnaireData={setQuestionnaire}
          language={language}
          setLanguage={setLanguage}
        />
      </Form>
    </Dialog>
  );
};

CreateSurvey.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateSurvey;

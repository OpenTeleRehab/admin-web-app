import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { createClinic, updateClinic } from 'store/clinic/actions';
import settings from 'settings';
import { getCountryISO, getCountryIsoCode, getTotalTherapistLimit } from 'utils/country';
import { Clinic as clinicService } from 'services/clinic';
import PhoneInput from 'react-phone-input-2';

const CreateClinic = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const [errorName, setErrorName] = useState(false);
  const [errorCity, setErrorCity] = useState(false);
  const [errorRegion, setErrorRegion] = useState(false);
  const [errorClass, setErrorClass] = useState('');
  const [errorPhoneMessage, setErrorPhoneMessage] = useState('');
  const [errorTherapistLimitMessage, setErrorTherapistLimitMessage] = useState('');
  const [errorTherapistLimit, setErrorTherapistLimit] = useState(false);
  const [therapistLimit, setTherapistLimit] = useState(0);
  const [totalTherapistLimitByCountry, setTotalTherapistLimitByCountry] = useState(0);
  const [totalTherapistByClinic, setTotalTherapistByClinic] = useState(0);

  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const profile = useSelector(state => state.auth.profile);
  const definedCountries = useSelector(state => state.country.definedCountries);

  const [formFields, setFormFields] = useState({
    name: '',
    country: '',
    region: '',
    province: '',
    city: '',
    country_iso: '',
    phone: '',
    therapist_limit: 0
  });

  useEffect(() => {
    if (profile !== undefined) {
      clinicService.countTherapistLimitByCountry(profile.country_id).then(res => {
        if (res.data) {
          setTotalTherapistLimitByCountry(res.data.total);
        }
      });

      if (countries.length) {
        setTherapistLimit(getTotalTherapistLimit(profile.country_id, countries));
      }
    }
  }, [profile, countries]);

  useEffect(() => {
    if (editId && clinics.length) {
      const clinic = clinics.find(clinic => clinic.id === editId);
      setFormFields({
        name: clinic.name,
        country: clinic.country_id,
        region: clinic.region,
        province: clinic.province,
        city: clinic.city,
        country_iso: getCountryISO(profile.country_id, countries),
        phone: clinic.phone || '',
        therapist_limit: clinic.therapist_limit
      });

      clinicService.countTherapistByClinic(clinic.id).then(res => {
        if (res.data) {
          setTotalTherapistByClinic(res.data.therapistTotal);
        }
      });
    } else if (profile) {
      setFormFields({
        ...formFields,
        country: profile.country_id,
        country_iso: getCountryISO(profile.country_id, countries)
      });
    }
    // eslint-disable-next-line
  }, [editId, profile, countries, clinics]);

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

    if (formFields.region === '') {
      canSave = false;
      setErrorRegion(true);
    } else {
      setErrorRegion(false);
    }

    if (formFields.city === '') {
      canSave = false;
      setErrorCity(true);
    } else {
      setErrorCity(false);
    }

    if (formFields.phone === '' || formFields.phone === undefined || formFields.dial_code === formFields.phone) {
      canSave = false;
      setErrorClass('d-block text-danger invalid-feedback');
      setErrorPhoneMessage(translate('error.phone'));
    } else {
      setErrorClass('invalid-feedback');
      setErrorPhoneMessage('');
    }

    const pattern = new RegExp(/^[0-9\b]+$/);
    if (formFields.therapist_limit === '') {
      canSave = false;
      setErrorTherapistLimit(true);
      setErrorTherapistLimitMessage(translate('error.country.therapist_limit'));
    } else if (!pattern.test(formFields.therapist_limit)) {
      canSave = false;
      setErrorTherapistLimit(true);
      setErrorTherapistLimitMessage(translate('error.country.therapist_limit.format'));
    } else if (editId && clinics.length) {
      const clinic = clinics.find(clinic => clinic.id === editId);
      if ((parseInt(totalTherapistLimitByCountry) + parseInt(formFields.therapist_limit) - parseInt(clinic.therapist_limit)) > therapistLimit) {
        setErrorTherapistLimitMessage(translate('error.country.therapist_limit.reached'));
        canSave = false;
        setErrorTherapistLimit(true);
      } else if (parseInt(formFields.therapist_limit) < totalTherapistByClinic) {
        setErrorTherapistLimitMessage(translate('error.country.therapist_limit.lessthan.therapist'));
        canSave = false;
        setErrorTherapistLimit(true);
      } else {
        setErrorTherapistLimit(false);
      }
    } else if ((parseInt(totalTherapistLimitByCountry) + parseInt(formFields.therapist_limit)) > therapistLimit) {
      setErrorTherapistLimitMessage(translate('error.country.therapist_limit.reached'));
      canSave = false;
      setErrorTherapistLimit(true);
    } else {
      setErrorTherapistLimit(false);
    }

    if (canSave) {
      let data = { ...formFields };
      const phoneValue = formFields.phone;
      const numOnly = phoneValue.split(formFields.dial_code);
      if (numOnly[1].match('^0')) {
        data = { ...data, phone: formFields.dial_code + numOnly[1].slice(1) };
      }

      if (editId) {
        dispatch(updateClinic(editId, data)).then(result => {
          if (result) {
            handleClose();
          }
        });
      } else {
        dispatch(createClinic(data)).then(result => {
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
      title={translate(editId ? 'clinic.edit' : 'clinic.new')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <Form.Group as={Col} controlId="countryIso">
            <Form.Label>{translate('clinic.country.iso_code')}: {formFields.country_iso}</Form.Label>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>{translate('clinic.name')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="name"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.clinic.name')}
              isInvalid={errorName}
              value={formFields.name}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.country.name')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="region">
            <Form.Label>{translate('clinic.region')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="region"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.clinic.region')}
              isInvalid={errorRegion}
              value={formFields.region}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.clinic.region')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="city">
            <Form.Label>{translate('clinic.city')}</Form.Label>
            <span className="text-dark ml-1">*</span>
            <Form.Control
              name="city"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.clinic.city')}
              isInvalid={errorCity}
              value={formFields.city}
              maxLength={settings.textMaxLength}
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.clinic.city')}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="province">
            <Form.Label>{translate('clinic.province')}</Form.Label>
            <Form.Control
              name="province"
              onChange={handleChange}
              type="text"
              placeholder={translate('placeholder.clinic.province')}
              value={formFields.province}
              maxLength={settings.textMaxLength}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="formPhone">
          <label htmlFor="phone">{translate('common.phone')}</label>
          <span className="text-dark ml-1">*</span>
          <PhoneInput
            inputProps={{
              id: 'phone'
            }}
            countryCodeEditable={false}
            country={getCountryIsoCode().toLowerCase()}
            value={formFields.phone}
            onlyCountries={
              definedCountries.map(country => { return country.iso_code.toLowerCase(); })
            }
            onChange={(value, country) => {
              setFormFields({ ...formFields, phone: value, dial_code: country.dialCode });
            }}
          />
          <Form.Control.Feedback type="invalid" class={errorClass}>
            {errorPhoneMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTherapistLimit">
          <Form.Label>{translate('common.therapist_limit')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Form.Control
            name="therapist_limit"
            onChange={handleChange}
            type="text"
            placeholder={translate('placeholder.country.therapist_limit')}
            isInvalid={errorTherapistLimit}
            value={formFields.therapist_limit}
          />
          <Form.Control.Feedback type="invalid">
            { errorTherapistLimitMessage }
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
    </Dialog>
  );
};

CreateClinic.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.string,
  handleClose: PropTypes.func
};

export default CreateClinic;

import React, { useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { createClinic, updateClinic } from 'store/clinic/actions';
import settings from 'settings';
import { getCountryISO, getCountryIsoCode } from 'utils/country';
import PhoneInput from 'react-phone-input-2';
import { useList } from 'hooks/useList';
import { useOne } from 'hooks/useOne';
import { END_POINTS } from 'variables/endPoint';
import Select from 'react-select';
import { useInvalidate } from 'hooks/useInvalidate';

const CreateClinic = ({ show, editId, handleClose }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const invalidate = useInvalidate();

  const [errorName, setErrorName] = useState(false);
  const [errorCity, setErrorCity] = useState(false);
  const [errorRegion, setErrorRegion] = useState(false);
  const [errorClass, setErrorClass] = useState('');
  const [errorPhoneMessage, setErrorPhoneMessage] = useState('');
  const [errorTherapistLimit, setErrorTherapistLimit] = useState('');
  const [errorProvince, setErrorProvince] = useState(false);

  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const profile = useSelector(state => state.auth.profile);
  const { data: regions } = useList(END_POINTS.REGION);
  const { data: provinces } = useList(END_POINTS.PROVINCE);
  const { data: provincesLimitation } = useList(END_POINTS.PROVINCES_LIMITATION);
  const definedCountries = useSelector(state => state.country.definedCountries);
  const { data: totalTherapist } = useOne(END_POINTS.COUNT_THERAPIST_BY_CLINIC, null, {
    enabled: !!editId,
    params: {
      clinic_id: editId
    }
  });

  const [formFields, setFormFields] = useState({
    name: '',
    country: '',
    region_id: '',
    province_id: '',
    city: '',
    country_iso: '',
    phone: '',
    therapist_limit: 0
  });

  const provinceOptions = useMemo(() => provinces?.data?.filter((province) => province.region_id === formFields.region_id) || [], [provinces, formFields.region_id]);

  const provinceLimitation = useMemo(() => {
    const provinceLimitation = provincesLimitation?.data?.find(province => province.id === formFields.province_id);
    return provinceLimitation;
  }, [provincesLimitation, formFields.province_id]);

  useEffect(() => {
    if (editId && clinics.length) {
      const clinic = clinics.find(clinic => clinic.id === editId);
      setFormFields({
        name: clinic.name,
        country_id: clinic.country_id,
        region_id: profile.region_id,
        province_id: clinic.province?.id,
        city: clinic.city,
        country_iso: getCountryISO(profile.country_id, countries),
        phone: clinic.phone || '',
        therapist_limit: clinic.therapist_limit,
        dial_code: clinic.dial_code
      });
    } else if (profile) {
      setFormFields({
        ...formFields,
        region_id: profile.region_id,
        country_id: profile.country_id,
        country_iso: getCountryISO(profile.country_id, countries)
      });
    }
    // eslint-disable-next-line
  }, [editId, profile, countries, clinics]);

  const handleChange = e => {
    const { name, value, type } = e.target;
    setFormFields({ ...formFields, [name]: type === 'number' ? Number(value) : value });
  };

  const handleSingleSelectChange = (key, value) => {
    setFormFields({ ...formFields, [key]: value });
  };

  const handleConfirm = () => {
    let canSave = true;

    if (formFields.name === '') {
      canSave = false;
      setErrorName(true);
    } else {
      setErrorName(false);
    }

    if (formFields.region_id === '') {
      canSave = false;
      setErrorRegion(true);
    } else {
      setErrorRegion(false);
    }

    if (!formFields.province_id) {
      canSave = false;
      setErrorProvince(true);
    } else {
      setErrorProvince(false);
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

    const clinic = clinics?.find(c => c.id === editId);
    const remainingTherapistLimit = provinceLimitation ? provinceLimitation.remaining_therapist_limit : 0;
    let exceedRemainingTherapistLimit = false;
    let translateParams = {
      allocated_therapist_limit: '',
      remaining_therapist_limit: '',
      therapist_limit_used: '',
    };

    if (clinic?.province.id !== formFields.province_id && formFields.therapist_limit > provinceLimitation?.remaining_therapist_limit) {
      exceedRemainingTherapistLimit = formFields.therapist_limit > remainingTherapistLimit;
      translateParams = {
        allocated_therapist_limit: provinceLimitation?.allocated_therapist_limit,
        remaining_therapist_limit: provinceLimitation?.remaining_therapist_limit,
        therapist_limit_used: provinceLimitation?.therapist_limit_used,
      };
    } else if (clinic?.province.id === formFields.province_id && formFields.therapist_limit > provinceLimitation?.remaining_therapist_limit + clinic.therapist_limit) {
      exceedRemainingTherapistLimit = formFields.therapist_limit > remainingTherapistLimit + clinic.therapist_limit;
      translateParams = {
        allocated_therapist_limit: provinceLimitation?.allocated_therapist_limit,
        remaining_therapist_limit: provinceLimitation?.remaining_therapist_limit + clinic?.therapist_limit,
        therapist_limit_used: provinceLimitation?.therapist_limit_used - clinic?.therapist_limit,
      };
    }

    if (formFields.therapist_limit <= 0) {
      canSave = false;
      setErrorTherapistLimit(translate('error.clinic.therapist_limit'));
    } else if (formFields.therapist_limit < totalTherapist?.therapistTotal) {
      canSave = false;
      setErrorTherapistLimit(translate('error.clinic.therapist_limit.less_than.total.therapist'));
    } else if (exceedRemainingTherapistLimit) {
      canSave = false;
      setErrorTherapistLimit(translate('error.clinic.therapist_limit.greater_than.province.therapist_limit', { ...translateParams }));
    } else {
      canSave = canSave && true;
      setErrorTherapistLimit('');
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
            invalidate(END_POINTS.PROVINCES_LIMITATION);
            handleClose();
          }
        });
      } else {
        dispatch(createClinic(data)).then(result => {
          if (result) {
            invalidate(END_POINTS.PROVINCES_LIMITATION);
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
      <Form onKeyDown={(e) => handleFormSubmit(e)}>
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
            <Select
              isDisabled
              placeholder={translate('placeholder.clinic.region')}
              classNamePrefix="filter"
              className={errorRegion ? 'is-invalid' : ''}
              value={regions?.data?.find((region) => region.id === formFields.region_id)}
              getOptionLabel={(option) => option.name}
              aria-label="Region"
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
            <span className="text-dark ml-1">*</span>
            <Select
              placeholder={translate('placeholder.clinic.province')}
              classNamePrefix="filter"
              className={errorProvince ? 'is-invalid' : ''}
              value={provinceOptions.find(region => region.id === formFields.province_id)}
              options={provinceOptions}
              onChange={(e) => handleSingleSelectChange('province_id', e.id)}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              aria-label="Region"
            />
            <Form.Control.Feedback type="invalid">
              {translate('error.clinic.region')}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="formPhone">
          <label htmlFor="phone">{translate('common.phone.number')}</label>
          <span className="text-dark ml-1">*</span>
          <PhoneInput
            inputProps={{
              id: 'phone'
            }}
            countryCodeEditable={false}
            country={getCountryIsoCode().toLowerCase()}
            value={formFields.phone}
            specialLabel=""
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
            type="number"
            placeholder={translate('placeholder.country.therapist_limit')}
            isInvalid={!!errorTherapistLimit}
            value={formFields.therapist_limit}
          />
          <Form.Control.Feedback type="invalid">
            {errorTherapistLimit}
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

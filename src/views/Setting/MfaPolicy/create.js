import React, { useEffect, useState } from 'react';
import Dialog from 'components/Dialog';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import 'react-datetime/css/react-datetime.css';
import { useDispatch, useSelector } from 'react-redux';
import { USER_GROUPS } from 'variables/user';
import { Row, Col, Form } from 'react-bootstrap';
import CustomSelect from 'components/Form/Select';
import { MFA_ROLES } from 'variables/mfa';
import { useForm } from 'react-hook-form';
import Radio from 'components/Form/Radio';
import Input from 'components/Form/Input';
import { MFA_ENFORCEMENT } from 'variables/mfaEnforcement';
import { createMfaSetting, updateMfaSetting } from 'store/mfaSetting/actions';

const CreateMfaPolicy = ({ show, handleClose, initialData }) => {
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const organizations = useSelector((state) => state.organization.organizations);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const mfaUserResources = useSelector(state => state.mfaSetting.mfaUserResources);
  const dispatch = useDispatch();
  const { control, watch, handleSubmit, setValue } = useForm({ defaultValues: initialData || {} });
  const role = watch('role');
  const country = watch('country_ids') || [];
  const [clinicOptions, setClinicOptions] = useState(
    (profile.type === USER_GROUPS.SUPER_ADMIN || profile.type === USER_GROUPS.ORGANIZATION_ADMIN) ? clinics.filter(item => watch('country_ids') && watch('country_ids').includes(item.country_id))
      .map(item => ({
        value: item.id,
        label: item.name
      })) : profile.type === USER_GROUPS.COUNTRY_ADMIN ? clinics.filter(item => profile.country_id.includes(item.country_id))
      .map(item => ({
        value: item.id,
        label: item.name
      })) : profile.clinic_id
  );
  const [countryOptions, setCountryOptions] = useState(
    countries.map(item => ({
      value: item.id,
      label: item.name
    }))
  );

  const organizationOptions = organizations.map(item => ({
    value: item.id,
    label: item.name
  }));

  const roleOptions = profile.type === USER_GROUPS.ORGANIZATION_ADMIN
    ? MFA_ROLES.filter(
      (option) => option.value !== USER_GROUPS.ORGANIZATION_ADMIN
    )
    : profile.type === USER_GROUPS.COUNTRY_ADMIN
      ? MFA_ROLES.filter(
        (option) =>
          option.value !== USER_GROUPS.ORGANIZATION_ADMIN &&
            option.value !== USER_GROUPS.COUNTRY_ADMIN
      )
      : profile.type === USER_GROUPS.CLINIC_ADMIN
        ? MFA_ROLES.filter(
          (option) =>
            option.value !== USER_GROUPS.ORGANIZATION_ADMIN &&
              option.value !== USER_GROUPS.COUNTRY_ADMIN &&
              option.value !== USER_GROUPS.CLINIC_ADMIN
        )
        : MFA_ROLES;

  useEffect(() => {
    if (profile.type === USER_GROUPS.COUNTRY_ADMIN) {
      setValue('country_ids', profile.country_id ? [Number(profile.country_id)] : []);
    } else if (profile.type === USER_GROUPS.CLINIC_ADMIN) {
      setValue('country_ids', profile.country_id ? [Number(profile.country_id)] : []);
      setValue('clinic_ids', profile.clinic_id ? [Number(profile.clinic_id)] : []);
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (
      mfaUserResources &&
      mfaUserResources.user_attributes &&
      profile.type !== USER_GROUPS.ORGANIZATION_ADMIN
    ) {
      const userAttributes = mfaUserResources.user_attributes;

      if (mfaUserResources && userAttributes.trustedDeviceMaxAge != null) {
        setValue('attributes.mfa_expiration_duration', userAttributes.trustedDeviceMaxAge[0]);
      }

      if (mfaUserResources && userAttributes.skipMfaMaxAge != null) {
        setValue('attributes.skip_mfa_setup_duration', userAttributes.skipMfaMaxAge[0]);
      }
    }
  }, [mfaUserResources, profile.type, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!['role', 'country_ids'].includes(name)) return;

      const _role = value.role;
      const _country = value.country_ids;

      const usedIds = (mfaUserResources && mfaUserResources.used_ids && mfaUserResources.used_ids[_role])
        ? mfaUserResources.used_ids[_role]
        : { used_clinic_ids: [], used_country_ids: [] };

      const filteredCountryOptions = countries
        .filter(c => !usedIds.used_country_ids.includes(c.id))
        .map(c => ({ value: c.id, label: c.name }));

      setCountryOptions(filteredCountryOptions);

      let clinicOptionsBase = [];

      if ([USER_GROUPS.SUPER_ADMIN, USER_GROUPS.ORGANIZATION_ADMIN].includes(profile.type)) {
        clinicOptionsBase = clinics.filter(c => _country && _country.length && _country.includes(c.country_id));
      } else if (profile.type === USER_GROUPS.COUNTRY_ADMIN) {
        clinicOptionsBase = clinics.filter(c => profile.country_id && profile.country_id.includes(c.country_id));
      } else if (profile.type === USER_GROUPS.CLINIC_ADMIN) {
        const clinic = clinics.find(c => c.id === profile.clinic_id);
        clinicOptionsBase = clinic ? [clinic] : [];
      }

      const filteredClinicOptions = clinicOptionsBase
        .filter(c => !usedIds.used_clinic_ids.includes(c.id))
        .map(c => ({ value: c.id, label: c.name }));

      setClinicOptions(filteredClinicOptions);
    });

    return () => subscription.unsubscribe();
  }, [watch, countries, clinics, profile, mfaUserResources]);

  const onConfirm = handleSubmit(async (data) => {
    if (data.role) {
      if (data.role === USER_GROUPS.COUNTRY_ADMIN) {
        data.clinic_ids = null;
      } else if (data.role === USER_GROUPS.ORGANIZATION_ADMIN) {
        data.country_ids = null;
        data.clinic_ids = null;
      }
    }

    if (initialData && initialData.id) {
      dispatch(updateMfaSetting(initialData.id, data));
    } else {
      dispatch(createMfaSetting(data));
    }
    handleClose();
  });

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate('mfa_policy.new')}
      onCancel={handleClose}
      onConfirm={onConfirm}
      confirmLabel={translate('common.create')}
      size="xl"
    >
      <Form onKeyDown={(e) => handleFormSubmit(e)}>
        <CustomSelect
          aria-label="role"
          control={control}
          name="role"
          getOptionLabel={option => translate('common.' + option.value)}
          rules={{ required: translate('survey.error.role') }}
          label={translate('survey.role')}
          options={roleOptions}
          placeholder={translate('survey.placeholder.role')}
          isClearable
        />
        {profile.type === USER_GROUPS.SUPER_ADMIN && (
          <CustomSelect
            control={control}
            name="organizations"
            options={organizationOptions}
            rules={{ required: translate('survey.error.oranization') }}
            isMulti
            label={translate('survey.organization')}
            placeholder={translate('survey.placeholder.organization')}
            isClearable
            aria-label="organization"
          />
        )}
        {role && (
          <>
            {(role !== USER_GROUPS.ORGANIZATION_ADMIN && (profile.type === USER_GROUPS.SUPER_ADMIN || profile.type === USER_GROUPS.ORGANIZATION_ADMIN)) && (
              <CustomSelect
                control={control}
                name="country_ids"
                options={countryOptions}
                rules={{ required: translate('error.country') }}
                isMulti
                isClearable
                aria-label="country"
                label={translate('common.country')}
                placeholder={translate('placeholder.country')}
              />
            )}
            {role !== USER_GROUPS.ORGANIZATION_ADMIN && role !== USER_GROUPS.COUNTRY_ADMIN && profile.type !== USER_GROUPS.CLINIC_ADMIN && (
              <CustomSelect
                control={control}
                name="clinic_ids"
                options={clinicOptions}
                rules={{ required: translate('error.clinic') }}
                isDisabled={(profile.type === USER_GROUPS.ORGANIZATION_ADMIN || profile.type === USER_GROUPS.SUPER_ADMIN) ? !country.length : false}
                isMulti
                isClearable
                aria-label="clinic"
                label={translate('common.clinic')}
                placeholder={translate('placeholder.clinic')}
              />
            )}
          </>
        )}
        <Radio
          control={control}
          label={translate('mfa.mfa_enforcement.label')}
          name="attributes.mfa_enforcement"
          options={[
            {
              label: translate('mfa.enforcement.disable'),
              value: MFA_ENFORCEMENT.DISABLE,
              disabled: mfaUserResources &&
                        mfaUserResources.user_attributes &&
                        mfaUserResources.user_attributes.available_enforcement &&
                        [MFA_ENFORCEMENT.RECOMMEND, MFA_ENFORCEMENT.ENFORCE]
                          .includes(mfaUserResources.user_attributes.available_enforcement[0])
            },
            {
              label: translate('mfa.enforcement.recommend'),
              value: MFA_ENFORCEMENT.RECOMMEND,
              disabled: mfaUserResources &&
                        mfaUserResources.user_attributes &&
                        mfaUserResources.user_attributes.available_enforcement &&
                        [MFA_ENFORCEMENT.ENFORCE]
                          .includes(mfaUserResources.user_attributes.available_enforcement[0])
            },
            {
              label: translate('mfa.enforcement.force'),
              value: MFA_ENFORCEMENT.ENFORCE
            }
          ]}
        />
        {profile && profile.type === USER_GROUPS.ORGANIZATION_ADMIN && (
          <Row>
            <Col md={6}>
              <Input
                control={control}
                type="number"
                name="attributes.mfa_expiration_duration"
                label={`${translate('mfa.mfa_expiration_duration.label')} - (${'mfa.second'})`}
              />
            </Col>
            <Col md={6}>
              <Input
                control={control}
                type="number"
                name="attributes.skip_mfa_setup_duration"
                label={`${translate('mfa.skip_mfa_setup_duration.label')} - (${'mfa.second'})`}
              />
            </Col>
          </Row>
        )}
      </Form>
    </Dialog>
  );
};

CreateMfaPolicy.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  initialData: PropTypes.object
};

export default CreateMfaPolicy;

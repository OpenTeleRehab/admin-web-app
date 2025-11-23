import React, { useEffect, useMemo } from 'react';
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
import { createMfaSetting, updateMfaSetting, getMfaEnforcementValidation } from 'store/mfaSetting/actions';
import { mutation } from 'store/mfaSetting/mutations';

const CreateMfaPolicy = ({ show, handleClose, initialData }) => {
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const mfaSettings = useSelector(state => state.mfaSetting.mfaSettings);
  const mfaEnforcementValidation = useSelector(state => state.mfaSetting.mfaEnforcementValidation);
  const organizations = useSelector((state) => state.organization.organizations);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const dispatch = useDispatch();
  const { control, watch, handleSubmit, reset } = useForm();
  const role = watch('role');

  const roleOptions = useMemo(
    () =>
      profile.type === USER_GROUPS.ORGANIZATION_ADMIN
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
            : MFA_ROLES,
    [profile.type]
  );

  useEffect(() => {
    reset({
      role: initialData ? initialData.role : '',
      organizations: initialData ? initialData.organizations : [],
      country_ids: initialData ? initialData.country_ids : [],
      clinic_ids: initialData ? initialData.clinic_ids : [],
      mfa_enforcement: initialData ? initialData.mfa_enforcement : null,
      mfa_expiration_duration: initialData ? initialData.mfa_expiration_duration : '',
      skip_mfa_setup_duration: initialData ? initialData.skip_mfa_setup_duration : ''
    });
  }, [initialData, reset]);

  useEffect(() => {
    if (role) {
      dispatch(getMfaEnforcementValidation(role));
    }

    return () => dispatch(mutation.clearMfaEnforcementValidation());
  }, [dispatch, role]);

  const useAvailableOrgOptions = (mfaSetting, orgOptions, role, selectedOrgIds = []) => {
    return useMemo(() => {
      const usedOrgIds = new Set(
        mfaSetting
          .filter(setting => setting.role === role)
          .flatMap(setting => setting.organizations)
      );

      return orgOptions.filter(
        org => !usedOrgIds.has(org.id) || selectedOrgIds.includes(org.id)
      );
    }, [mfaSetting, orgOptions, role, selectedOrgIds]);
  };

  const useAvailableCountryOptions = (mfaSetting, countryOptions, role, selectedCountryIds = []) => {
    return useMemo(() => {
      const usedCountryIds = new Set(
        mfaSetting
          .filter(setting => setting.role === role)
          .flatMap(setting => setting.country_ids)
      );

      return countryOptions.filter(country => !usedCountryIds.has(country.id) || selectedCountryIds.includes(country.id));
    }, [mfaSetting, countryOptions, role, selectedCountryIds]);
  };

  const useAvailableClinicOptions = (mfaSetting, clinicOptions, role) => {
    return useMemo(() => {
      const usedClinicIds = new Set(
        mfaSetting
          .filter(setting => setting.role === role)
          .flatMap(setting => setting.clinic_ids)
      );

      return clinicOptions.filter(clinic => !usedClinicIds.has(clinic.id));
    }, [mfaSetting, clinicOptions, role]);
  };

  const onConfirm = handleSubmit(async (data) => {
    if (data.role) {
      if (data.role === USER_GROUPS.COUNTRY_ADMIN) {
        data.clinic_ids = undefined;
      } else if (data.role === USER_GROUPS.ORGANIZATION_ADMIN) {
        data.country_ids = undefined;
        data.clinic_ids = undefined;
      }
    }

    data = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );

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
      confirmLabel={initialData ? translate('common.save') : translate('common.create')}
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
            options={useAvailableOrgOptions(mfaSettings, organizations, watch('role'), initialData && initialData.organizations).map(item => ({
              value: item.id,
              label: item.name
            }))}
            rules={{ required: translate('survey.error.oranization') }}
            isMulti
            label={translate('survey.organization')}
            placeholder={translate('survey.placeholder.organization')}
            isClearable
            aria-label="organization"
          />
        )}
        {profile.type === USER_GROUPS.ORGANIZATION_ADMIN && (
          <CustomSelect
            control={control}
            name="country_ids"
            options={useAvailableCountryOptions(mfaSettings, countries, watch('role'), initialData && initialData.country_ids).map(item => ({
              value: item.id,
              label: item.name
            }))}
            rules={{ required: translate('error.country') }}
            isMulti
            isClearable
            aria-label="country"
            label={translate('common.country')}
            placeholder={translate('placeholder.country')}
          />
        )}
        {profile.type === USER_GROUPS.COUNTRY_ADMIN && (
          <CustomSelect
            control={control}
            name="clinic_ids"
            options={useAvailableClinicOptions(mfaSettings, clinics, watch('role')).map(item => ({
              value: item.id,
              label: item.name
            }))}
            rules={{ required: translate('error.clinic') }}
            isMulti
            isClearable
            aria-label="clinic"
            label={translate('common.clinic')}
            placeholder={translate('placeholder.clinic')}
          />
        )}
        <Radio
          control={control}
          label={translate('mfa.mfa_enforcement.label')}
          name="mfa_enforcement"
          options={[
            {
              label: translate('mfa.enforcement.disable'),
              value: MFA_ENFORCEMENT.DISABLE,
              disabled: ['recommend', 'force'].includes(mfaEnforcementValidation)
            },
            {
              label: translate('mfa.enforcement.recommend'),
              value: MFA_ENFORCEMENT.RECOMMEND,
              disabled: ['force'].includes(mfaEnforcementValidation)
            },
            {
              label: translate('mfa.enforcement.force'),
              value: MFA_ENFORCEMENT.ENFORCE
            }
          ]}
        />
        {watch('mfa_enforcement') && watch('mfa_enforcement') !== MFA_ENFORCEMENT.DISABLE && (profile && profile.type === USER_GROUPS.ORGANIZATION_ADMIN) && (
          <Row>
            <Col md={6}>
              <Input
                control={control}
                type="number"
                name="mfa_expiration_duration"
                rules={{ required: 'This field is required' }}
                label={translate('mfa.mfa_expiration_duration.label')}
                placeholder={translate('mfa.expiration.duration.placeholder')}
                endIcon={translate('common.seconds')}
              />
            </Col>
            {watch('mfa_enforcement') === MFA_ENFORCEMENT.RECOMMEND && (
              <Col md={6}>
                <Input
                  control={control}
                  type="number"
                  name="skip_mfa_setup_duration"
                  rules={{ required: 'This field is required' }}
                  label={translate('mfa.skip_mfa_setup_duration.label')}
                  placeholder={translate('mfa.skip.setup.duration.placeholder')}
                  endIcon={translate('common.seconds')}
                />
              </Col>
            )}
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

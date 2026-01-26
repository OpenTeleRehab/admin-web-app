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
import { useList } from 'hooks/useList';

const CreateMfaPolicy = ({ show, handleClose, initialData }) => {
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const mfaSettings = useSelector(state => state.mfaSetting.mfaSettings);
  const mfaEnforcementValidation = useSelector(state => state.mfaSetting.mfaEnforcementValidation);
  const organizations = useSelector((state) => state.organization.organizations);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const { data: regions } = useList('regions/by-auth-country');
  const { data: phcServices } = useList('phc-services-by-region');
  const dispatch = useDispatch();
  const { control, watch, handleSubmit, reset } = useForm();
  const role = watch('role');

  const durationUnits = [
    { label: 'Seconds', value: 'seconds' },
    { label: 'Minutes', value: 'minutes' },
    { label: 'Hours', value: 'hours' },
    { label: 'Days', value: 'days' },
    { label: 'Weeks', value: 'weeks' }
  ];

  const EXCLUDED_ROLES_BY_PROFILE = {
    [USER_GROUPS.ORGANIZATION_ADMIN]: [
      USER_GROUPS.ORGANIZATION_ADMIN,
      USER_GROUPS.TRANSLATOR,
    ],
    [USER_GROUPS.COUNTRY_ADMIN]: [
      USER_GROUPS.ORGANIZATION_ADMIN,
      USER_GROUPS.COUNTRY_ADMIN,
      USER_GROUPS.TRANSLATOR,
    ],
    [USER_GROUPS.REGIONAL_ADMIN]: [
      USER_GROUPS.ORGANIZATION_ADMIN,
      USER_GROUPS.COUNTRY_ADMIN,
      USER_GROUPS.REGIONAL_ADMIN,
      USER_GROUPS.TRANSLATOR,
    ],
    [USER_GROUPS.PHC_SERVICE_ADMIN]: [
      USER_GROUPS.REGIONAL_ADMIN,
      USER_GROUPS.PHC_SERVICE_ADMIN,
      USER_GROUPS.CLINIC_ADMIN,
      USER_GROUPS.TRANSLATOR,
      USER_GROUPS.THERAPIST,
      USER_GROUPS.COUNTRY_ADMIN,
      USER_GROUPS.ORGANIZATION_ADMIN,
    ],
    [USER_GROUPS.CLINIC_ADMIN]: [
      USER_GROUPS.REGIONAL_ADMIN,
      USER_GROUPS.PHC_SERVICE_ADMIN,
      USER_GROUPS.ORGANIZATION_ADMIN,
      USER_GROUPS.COUNTRY_ADMIN,
      USER_GROUPS.CLINIC_ADMIN,
      USER_GROUPS.PHC_WORKER,
      USER_GROUPS.TRANSLATOR,
    ],
  };

  const roleOptions = useMemo(() => {
    const excluded = EXCLUDED_ROLES_BY_PROFILE[profile.type];

    if (!excluded) return MFA_ROLES;

    return MFA_ROLES.filter(
      (option) => !excluded.includes(option.value)
    );
  }, [profile.type]);

  useEffect(() => {
    reset({
      role: initialData ? initialData.role : '',
      organizations: initialData ? initialData.organizations : [],
      country_ids: initialData ? initialData.country_ids : [],
      region_ids: initialData ? initialData.region_ids : [],
      clinic_ids: initialData ? initialData.clinic_ids : [],
      phc_service_ids: initialData ? initialData.phc_service_ids : [],
      mfa_enforcement: initialData ? initialData.mfa_enforcement : null,
      mfa_expiration_duration: initialData ? initialData.mfa_expiration_duration : '',
      skip_mfa_setup_duration: initialData ? initialData.skip_mfa_setup_duration : '',
      mfa_expiration_unit: initialData ? initialData.mfa_expiration_unit : 'seconds',
      skip_mfa_setup_unit: initialData ? initialData.skip_mfa_setup_unit : 'seconds'
    });
  }, [initialData, reset]);

  useEffect(() => {
    if (role) {
      dispatch(getMfaEnforcementValidation(role));
    }

    return () => dispatch(mutation.clearMfaEnforcementValidation());
  }, [dispatch, role]);

  const organizationOptions = useMemo(() => {
    const usedOrganizationIds = new Set(
      mfaSettings
        ?.filter(setting => setting.role === role)
        .flatMap(setting => setting.organizations)
    );

    return organizations?.filter(organization => !usedOrganizationIds.has(organization.id) || initialData?.organizations?.includes(organization.id));
  }, [mfaSettings, organizations, initialData, role]);

  const countryOptions = useMemo(() => {
    const usedCountryIds = new Set(
      mfaSettings
        ?.filter(setting => setting.role === role)
        .flatMap(setting => setting.country_ids)
    );

    return countries?.filter(country => !usedCountryIds.has(country.id) || initialData?.country_ids?.includes(country.id));
  }, [mfaSettings, countries, role, initialData]);

  const regionOptions = useMemo(() => {
    const usedRegionIds = new Set(
      mfaSettings
        ?.filter(setting => setting.role === role)
        .flatMap(setting => setting.region_ids)
    );

    return regions?.data?.filter(region => !usedRegionIds.has(region.id) || initialData?.region_ids?.includes(region.id));
  }, [mfaSettings, regions, role, initialData]);

  const phcServiceOptions = useMemo(() => {
    const usedPhcServiceIds = new Set(
      mfaSettings
        ?.filter(setting => setting.role === role)
        .flatMap(setting => setting.phc_service_ids)
    );

    return phcServices?.data?.filter(phcService => !usedPhcServiceIds.has(phcService.id) || initialData?.phc_service_ids?.includes(phcService.id));
  }, [mfaSettings, phcServices, role, initialData]);

  const clinicOptions = useMemo(() => {
    const usedClinicIds = new Set(
      mfaSettings
        ?.filter(setting => setting.role === role)
        .flatMap(setting => setting.clinic_ids)
    );

    return clinics?.filter(clinic => !usedClinicIds.has(clinic.id) || initialData?.clinic_ids?.includes(clinic.id));
  }, [mfaSettings, clinics, role, initialData]);

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
            options={organizationOptions?.map(item => ({
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
            options={countryOptions?.map(item => ({
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
            name="region_ids"
            options={regionOptions?.map(item => ({
              value: item.id,
              label: item.name
            }))}
            rules={{ required: translate('error.region') }}
            isMulti
            isClearable
            aria-label="region"
            label={translate('common.region')}
            placeholder={translate('placeholder.region')}
          />
        )}
        {profile.type === USER_GROUPS.REGIONAL_ADMIN && (role === USER_GROUPS.CLINIC_ADMIN || role === USER_GROUPS.THERAPIST) && (
          <CustomSelect
            control={control}
            name="clinic_ids"
            options={clinicOptions?.map(item => ({
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
        {profile.type === USER_GROUPS.REGIONAL_ADMIN && (role === USER_GROUPS.PHC_SERVICE_ADMIN || role === USER_GROUPS.PHC_WORKER) && (
          <CustomSelect
            control={control}
            name="phc_service_ids"
            options={phcServiceOptions?.map(item => ({
              value: item.id,
              label: item.name
            }))}
            rules={{ required: translate('error.phc_service') }}
            isMulti
            isClearable
            aria-label="phcService"
            label={translate('common.phc_service')}
            placeholder={translate('placeholder.phc_service')}
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
              disabled: ['recommend', 'force'].includes(mfaEnforcementValidation),
              ...(['recommend', 'force'].includes(mfaEnforcementValidation) && {
                title: translate('mfa.enforcement.disable.description', {
                  mfaEnforcementValidation: mfaEnforcementValidation
                })
              })
            },
            {
              label: translate('mfa.enforcement.recommend'),
              value: MFA_ENFORCEMENT.RECOMMEND,
              disabled: ['force'].includes(mfaEnforcementValidation),
              ...(['force'].includes(mfaEnforcementValidation) && {
                title: translate('mfa.enforcement.disable.description', {
                  mfaEnforcementValidation: mfaEnforcementValidation
                })
              })
            },
            {
              label: translate('mfa.enforcement.force'),
              value: MFA_ENFORCEMENT.ENFORCE
            }
          ]}
        />
        {watch('mfa_enforcement') && watch('mfa_enforcement') !== MFA_ENFORCEMENT.DISABLE && (profile && profile.type === USER_GROUPS.ORGANIZATION_ADMIN) && (
          <Row>
            <Col md={4} className="pr-0">
              <Input
                control={control}
                type="number"
                name="mfa_expiration_duration"
                rules={{ required: 'This field is required' }}
                label={translate('mfa.mfa_expiration_duration.label')}
                placeholder={translate('mfa.expiration.duration.placeholder')}
              />
            </Col>
            <Col md={2} className="pl-0">
              <CustomSelect
                control={control}
                rules={{ required: translate('error.mfa_expiration_unit') }}
                name="mfa_expiration_unit"
                label={translate('mfa.mfa_expiration_unit.label')}
                labelClassName="invisible"
                options={durationUnits}
                placeholder={translate('mfa.mfa_expiration_unit.placeholder')}
              />
            </Col>
            {watch('mfa_enforcement') === MFA_ENFORCEMENT.RECOMMEND && (
              <>
                <Col md={4} className="pr-0">
                  <Input
                    control={control}
                    type="number"
                    name="skip_mfa_setup_duration"
                    rules={{ required: 'This field is required' }}
                    label={translate('mfa.skip_mfa_setup_duration.label')}
                    placeholder={translate('mfa.skip.setup.duration.placeholder')}
                  />
                </Col>
                <Col md={2} className="pl-0">
                  <CustomSelect
                    control={control}
                    rules={{ required: translate('error.skip_mfa_setup_unit') }}
                    name="skip_mfa_setup_unit"
                    label={translate('mfa.skip_mfa_setup_unit.label')}
                    labelClassName="invisible"
                    options={durationUnits}
                    placeholder={translate('mfa.skip_mfa_setup_unit.placeholder')}
                  />
                </Col>
              </>
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

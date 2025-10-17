import React, { useEffect } from 'react';
import Dialog from 'components/Dialog';
import { getTranslate } from 'react-localize-redux';
import PropTypes from 'prop-types';

import 'react-datetime/css/react-datetime.css';
import { useSelector } from 'react-redux';
import { USER_GROUPS } from 'variables/user';
import { Row, Col, Form } from 'react-bootstrap';
import CustomSelect from 'components/Form/Select';
import { MFA_ROLES } from 'variables/mfa';
import { useForm } from 'react-hook-form';
import Radio from 'components/Form/Radio';
import Input from 'components/Form/Input';
import { MFA_ENFORCEMENT } from 'variables/mfaEnforcement';

const CreateMfaPolicy = ({ show, handleClose }) => {
  const { profile } = useSelector((state) => state.auth);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const organizations = useSelector((state) => state.organization.organizations);
  const countries = useSelector(state => state.country.countries);
  const clinics = useSelector(state => state.clinic.clinics);
  const { control, watch, handleSubmit, setValue } = useForm();
  const role = watch('role');
  const country = watch('country') || [];
  const clinicOptions = (profile.type === USER_GROUPS.SUPER_ADMIN || profile.type === USER_GROUPS.ORGANIZATION_ADMIN) ? clinics.filter(item => watch('country') && watch('country').includes(item.country_id))
    .map(item => ({
      value: item.id,
      label: item.name
    })) : profile.type === USER_GROUPS.COUNTRY_ADMIN ? clinics.filter(item => profile.country_id.includes(item.country_id))
    .map(item => ({
      value: item.id,
      label: item.name
    })) : profile.clinic_id;
  const organizationOptions = organizations.map(item => ({
    value: item.id,
    label: item.name
  }));
  const countryOptions = countries.map(item => ({
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
    if (watch('role') === USER_GROUPS.ORGANIZATION_ADMIN) {
      setValue('country', '');
    }
  }, [role, setValue]);

  const onConfirm = handleSubmit(async (data) => {
    const payload = {
      attributes: {
        ...data
      }
    };
    console.log(payload);
  });

  return (
    <Dialog
      show={show}
      title={translate('mfa_policy.new')}
      onCancel={handleClose}
      onConfirm={onConfirm}
      confirmLabel={translate('common.create')}
      size="xl"
    >
      <Form>
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
            name="organization"
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
                name="country"
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
                name="clinic"
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
          label={translate('mfa.enforcement')}
          name="mfa_enforcement"
          options={[
            {
              label: translate('mfa.enforcement.disable'),
              value: MFA_ENFORCEMENT.DISABLE
            },
            {
              label: translate('mfa.enforcement.recommend'),
              value: MFA_ENFORCEMENT.RECOMMEND
            },
            {
              label: translate('mfa.enforcement.force'),
              value: MFA_ENFORCEMENT.ENFORCE
            }
          ]}
        />
        <Row>
          <Col md={6}>
            <Input control={control} type="number" name="mfa_expiration_duration" label={translate('mfa.expiration.duration')} />
          </Col>
          <Col md={6}>
            <Input
              control={control}
              type="number"
              name="skip_mfa_setup_duration"
              label={translate('skip.mfa.setup.duration')}
            />
          </Col>
        </Row>
      </Form>
    </Dialog>
  );
};

CreateMfaPolicy.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
};

export default CreateMfaPolicy;

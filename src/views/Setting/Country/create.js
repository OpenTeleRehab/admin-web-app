import React, { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import Dialog from 'components/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getDefinedCountries } from 'store/country/actions';
import { useForm } from 'react-hook-form';
import Input from 'components/V2/Form/Input';
import CustomSelect from 'components/V2/Form/Select';
import { useCreate } from 'hooks/useCreate';
import useToast from 'components/V2/Toast';
import { useTranslate } from 'hooks/useTranslate';
import { useOne } from 'hooks/useOne';
import { useUpdate } from 'hooks/useUpdate';
import { END_POINTS } from 'variables/endPoint';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { useInvalidate } from 'hooks/useInvalidate';

const CreateCountry = ({ show, editId, handleClose }) => {
  const translate = useTranslate();
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { showToast } = useToast();
  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      language_id: '',
      therapist_limit: 50
    }
  });
  const { data: country } = useOne(END_POINTS.COUNTRY, editId);
  const selectedCountry = watch(END_POINTS.COUNTRY);
  const { data: orgLimitation } = useOne(
    END_POINTS.ORGANIZATION_LIMITATION,
    null,
    { enabled: true }
  );
  const { data: countryLimitation } = useOne(
    END_POINTS.COUNTRY_LIMITATION,
    null,
    {
      params: { country_id: editId },
      enabled: !!editId
    }
  );
  const { mutate: createCountry } = useCreate(END_POINTS.COUNTRY);
  const { mutate: updateCountry } = useUpdate(END_POINTS.COUNTRY);
  const languages = useSelector(state => state.language.languages);
  const definedCountries = useSelector(state => state.country.definedCountries);

  useEffect(() => {
    dispatch(getDefinedCountries());
  }, [dispatch]);

  useEffect(() => {
    const country = definedCountries.find((c) => c.iso_code === selectedCountry);

    if (country) {
      setValue('iso_code', country.iso_code, { shouldValidate: true });
      setValue('phone_code', country.phone_code, { shouldValidate: true });
      setValue('name', country.name, { shouldValidate: true });
    }
  }, [selectedCountry, definedCountries, setValue]);

  useEffect(() => {
    if (editId && country) {
      reset({
        ...country,
        country: country.iso_code,
        language: country.language_id
      });
    }
  }, [editId, country]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));
    if (editId) {
      updateCountry({ id: editId, payload: data }, {
        onSuccess: async (res) => {
          dispatch(showSpinner(false));
          invalidate(END_POINTS.ORGANIZATION_LIMITATION);
          invalidate(END_POINTS.COUNTRY_LIMITATION);
          showToast({
            title: translate('success_message.country_update'),
            message: translate(res?.message),
            color: 'success'
          });
          handleClose();
        },
        onError: () => {
          invalidate(END_POINTS.ORGANIZATION_LIMITATION);
          invalidate(END_POINTS.COUNTRY_LIMITATION);
          dispatch(showSpinner(false));
        }
      });

      return;
    }

    createCountry(data, {
      onSuccess: async (res) => {
        dispatch(showSpinner(false));
        invalidate(END_POINTS.ORGANIZATION_LIMITATION);
        invalidate(END_POINTS.COUNTRY_LIMITATION);
        showToast({
          title: translate('success_message.country_add'),
          message: translate(res?.message),
          color: 'success'
        });
        handleClose();
      },
      onError: () => {
        invalidate(END_POINTS.ORGANIZATION_LIMITATION);
        invalidate(END_POINTS.COUNTRY_LIMITATION);
        dispatch(showSpinner(false));
      }
    });
  });

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Dialog
      show={show}
      title={translate(editId ? 'country.edit' : 'country.new')}
      onCancel={handleClose}
      onConfirm={onSubmit}
      confirmLabel={editId ? translate('common.save') : translate('common.create')}
    >
      <Form onKeyDown={(e) => handleFormSubmit(e)}>
        <Form.Row>
          <CustomSelect
            as={Col}
            control={control}
            name='country'
            rules={{ required: translate('error.country.name') }}
            label={translate('country.name')}
            options={definedCountries.map((c) => ({ label: c.name, value: c.iso_code }))}
            placeholder={translate('placeholder.country')}
          />
          <Input
            as={Col}
            control={control}
            name='iso_code'
            label={translate('country.iso_code')}
            disabled
            rules={{ required: true }}
            placeholder={translate('placeholder.country.iso_code')}
          />
        </Form.Row>
        <Form.Row>
          <Input
            as={Col}
            control={control}
            name='phone_code'
            label={translate('country.phone_code')}
            disabled
            rules={{ required: true }}
            placeholder={translate('placeholder.country.phone_code')}
          />
          <CustomSelect
            as={Col}
            control={control}
            name='language_id'
            label={translate('common.language')}
            options={languages.map((lang) => ({ label: lang.name, value: lang.id }))}
          />
        </Form.Row>
        <Input
          control={control}
          name='therapist_limit'
          rules={{
            required: translate('error.organization.max_number_of_therapist'),
            validate: (value) => {
              const numValue = Number(value);
              const orgLimit = orgLimitation ? orgLimitation.remaining_therapist_limit : 0;
              const countryUsed = countryLimitation ? countryLimitation.therapist_limit_used : 0;
              const exceedsOrgLimit = editId ? numValue > orgLimit + country.therapist_limit : numValue > orgLimit;

              if (value <= 0) {
                return translate('error.country.therapist_limit.equal_to.zero');
              }

              if (exceedsOrgLimit) {
                return translate('error.country.therapist_limit.more_than.org_therapist_limit');
              }

              const belowUsedLimit = editId && numValue < countryUsed;

              if (belowUsedLimit) {
                return translate('error.country.therapist_limit.lessthan.therapist_limit_clinic');
              }

              return true;
            }
          }}
          label={translate('common.therapist_limit')}
          placeholder={translate('placeholder.country.therapist_limit')}
        />
        <Input
          control={control}
          name='phc_worker_limit'
          min={0}
          rules={{
            required: translate('error.organization.max_number_of_phc_worker'),
            validate: (value) => {
              const numValue = Number(value);
              const orgLimit = orgLimitation ? orgLimitation.remaining_phc_worker_limit : 0;
              const countryUsed = countryLimitation ? countryLimitation.phc_worker_limit_used : 0;
              const exceedsOrgLimit = editId ? numValue > orgLimit + country.phc_worker_limit : numValue > orgLimit;

              if (value <= 0) {
                return translate('error.country.phc_worker_limit.equal_to.zero');
              }

              if (exceedsOrgLimit) {
                return translate('error.country.phc_worker_limit.more_than.org_phc_worker_limit');
              }

              const belowUsedLimit = editId && numValue < countryUsed;

              if (belowUsedLimit) {
                return translate('error.country.phc_worker_limit.lessthan.phc_worker_limit_clinic');
              }

              return true;
            }
          }}
          label={translate('common.phc_worker_limit')}
          placeholder={translate('placeholder.country.phc_worker_limit')}
        />
      </Form>
    </Dialog>
  );
};

CreateCountry.propTypes = {
  show: PropTypes.bool,
  editId: PropTypes.number,
  handleClose: PropTypes.func
};

export default CreateCountry;

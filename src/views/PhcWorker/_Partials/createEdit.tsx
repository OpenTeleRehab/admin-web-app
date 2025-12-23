import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getCountryName, getCountryIdentity } from 'utils/country';
import { Therapist as therapistService } from 'services/therapist';

import {
  getTotalOnGoingTreatment
} from 'utils/patient';
import { useTranslate } from 'hooks/useTranslate';
import { useForm } from 'react-hook-form';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { useUpdate } from 'hooks/useUpdate';
import { END_POINTS } from 'variables/endPoint';
import { useCreate } from 'hooks/useCreate';
import useToast from 'components/V2/Toast';
import useDialog from 'components/V2/Dialog';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import DialogBody from 'components/V2/Dialog/DialogBody';
import Input from 'components/V2/Form/Input';
import Select from 'components/V2/Form/Select';
import PhoneInput from 'components/V2/Form/PhoneInput';
import { IPhcWorker } from 'interfaces/IPhcWorker';
import { useList } from 'hooks/useList';

const CreateEditPhcWorker = ({ phcWorker } : {phcWorker?: IPhcWorker}) => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { closeDialog } = useDialog();
  const countries = useSelector((state: any) => state.country.countries);
  const { maxPhcOngoingTreatmentPlans } = useSelector((state: any) => state.organization);
  const [patients, setPatients] = useState([]);
  const [onGoingPatients, setOngoingPatient] = useState(0);

  const { profile } = useSelector((state: any) => state.auth);
  const languages = useSelector((state: any) => state.language.languages);
  const { control, reset, handleSubmit, setValue } = useForm<any>();
  const { data: professions } = useList<any>(END_POINTS.PROFESSIONS);
  const { mutate: createPhcWorkerMutation } = useCreate(END_POINTS.PHC_WORKERS);
  const { mutate: updatePhcWorkerMutation } = useUpdate(END_POINTS.PHC_WORKERS);

  useEffect(() => {
    if (phcWorker) {
      // TODO: fetch patients by phcWorker id to check for ongoing treatments
      therapistService.getPatientByTherapistId(phcWorker.id).then(res => {
        if (res.data) {
          setPatients(res.data);
        }
      });
      reset(phcWorker);
    } else {
      setValue('country_identity', getCountryIdentity(profile.country_id, countries));
      setValue('phc_service_identity', profile.phc_service.identity);
      setValue('limit_patient', maxPhcOngoingTreatmentPlans);
    }
  }, [phcWorker, maxPhcOngoingTreatmentPlans, profile, countries, setValue, reset]);

  useEffect(() => {
    if (profile) {
      setValue('country_name', getCountryName(profile.country_id, countries));
      setValue('region_name', profile.region_name);
      setValue('province_name', profile.phc_service.province_name);
      setValue('phc_service_name', profile.phc_service.name);
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (patients.length) {
      setOngoingPatient(getTotalOnGoingTreatment(phcWorker?.id, patients));
    }
  }, [patients, phcWorker]);

   const onSubmit = handleSubmit(async (data) => {
      dispatch(showSpinner(true));
      const language = languages.find((item: any) => item.id === data.language_id);
      if (phcWorker) {
        updatePhcWorkerMutation({ id: phcWorker.id, payload: { ...data, limit_patient: Number(data.limit_patient), language_code: language?.code } }, {
          onSuccess: async (res) => {
            dispatch(showSpinner(false));
            showToast({
              title: t('phc_worker.edit'),
              message: t(res.message),
              color: 'success'
            });
            closeDialog();
          },
          onError: () => {
            dispatch(showSpinner(false));
          }
        });

        return;
      }

      createPhcWorkerMutation({ ...data, limit_patient: Number(data.limit_patient), language_code: language?.code }, {
        onSuccess: async (res) => {
          dispatch(showSpinner(false));
          showToast({
            title: t('phc_worker.new'),
            message: t(res?.message),
            color: 'success'
          });
          closeDialog();
        },
        onError: () => {
          dispatch(showSpinner(false));
        }
      });
    });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Row>
          <Col>
            <Input
              control={control}
              name="email"
              type="email"
              label={t('common.email')}
              placeholder={t('placeholder.email')}
              rules={{ required: t('error.email') }}
              disabled={!!phcWorker}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <PhoneInput
              control={control}
              name='phone'
              label={t('common.phone.number')}
              setValue={setValue}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='country_name'
              label={t('common.country')}
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='region_name'
              label={t('common.region')}
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='province_name'
              label={t('common.province')}
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <Input
              control={control}
              label={t('common.limit_treatment', { defaultLimitedPatients: maxPhcOngoingTreatmentPlans })}
              name="limit_patient"
              type="number"
              min={0}
              placeholder={t('placeholder.limit_patient')}
              rules={{
                required: t('error.limit_patient'),
                validate: (value) => {
                  const numValue = Number(value);

                  if (onGoingPatients > 0 && numValue < onGoingPatients) {
                    return t('error.limit_patient.lessthan');
                  }

                  if (numValue > maxPhcOngoingTreatmentPlans) {
                    return t('error.over_default_limit_patient');
                  }

                  return true;
                }
              }}
            />
          </Col>
        </Row>
        <Row>
           <Col sm={12} md={6}>
            <Input
              control={control}
              name='last_name'
              label={t('common.last_name')}
              placeholder={t('placeholder.last_name')}
              rules={{ required: t('error.last_name') }}
            />
          </Col>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='first_name'
              label={t('common.first_name')}
              placeholder={t('placeholder.first_name')}
              rules={{ required: t('error.first_name') }}
            />
          </Col>
        </Row>
        <Row>
           <Col sm={12} md={6}>
            <Select
              control={control}
              name='profession_id'
              label={t('common.profession')}
              placeholder={t('placeholder.profession')}
              options={(professions?.data || []).map((profession: any) => ({
                label: profession.name,
                value: profession.id
              }))}
            />
          </Col>
          <Col sm={12} md={6}>
            <Input
              control={control}
              name='phc_service_name'
              label={t('common.phc_service')}
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Select
              control={control}
              name='language_id'
              label={t('common.language')}
              placeholder={t('placeholder.language')}
              options={languages.map((language: any) => ({
                label: language.name,
                value: language.id
              }))}
            />
          </Col>
        </Row>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit'>
          {phcWorker ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateEditPhcWorker;

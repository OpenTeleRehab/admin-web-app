import useDialog from 'components/V2/Dialog';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Select from 'components/V2/Form/Select';
import useToast from 'components/V2/Toast';
import { useCreate } from 'hooks/useCreate';
import { useInvalidate } from 'hooks/useInvalidate';
import { useList } from 'hooks/useList';
import { useTranslate } from 'hooks/useTranslate';
import React, { useMemo } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { END_POINTS } from 'variables/endPoint';

type ReferralFormProps = {
  referralId: number;
}

const ReferralForm = ({ referralId }: ReferralFormProps) => {
  const t = useTranslate();
  const invalidate = useInvalidate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const profile = useSelector((state: any) => state.auth.profile);
  const { control, handleSubmit } = useForm();
  const { data: therapists } = useList(END_POINTS.THERAPIST_BY_CLINIC, { clinic_id: profile.clinic_id });
  const { mutate: createReferral } = useCreate(END_POINTS.PATIENT_REFERRAL_ASSIGNMENT);

  const therapistOptions = useMemo(() => {
    return (therapists?.data ?? []).map((t: any) => ({
      label: `${t.first_name} ${t.last_name}`,
      value: t.id,
    }));
  }, [therapists]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      referral_id: referralId,
    };

    createReferral(payload, {
      onSuccess: (res) => {
        showToast({
          title: t('patient.referral_assignment.title'),
          message: t(res.message),
        });
        invalidate(END_POINTS.PATIENT_REFERRAL);
        closeDialog();
      }
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Select
          control={control}
          name='therapist_id'
          label={t('therapist')}
          placeholder={t('placeholder.therapist')}
          rules={{ required: t('error.therapist') }}
          options={therapistOptions}
        />
      </DialogBody>
      <DialogFooter>
        <Button type='submit'>{t('common.save')}</Button>
        <Button variant="outline-dark" onClick={closeDialog}>{t('common.cancel')}</Button>
      </DialogFooter>
    </Form>
  );
};

export default ReferralForm;

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useTranslate } from 'hooks/useTranslate';
import { Button, Form } from 'react-bootstrap';
import { END_POINTS } from 'variables/endPoint';
import { useOne } from '../../../hooks/useOne';
import { useUpdate } from 'hooks/useUpdate';
import { IEmailTemplateRequest } from '../../../interfaces/IEmailTemplate';
import Input from 'components/V2/Form/Input';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import DialogBody from 'components/V2/Dialog/DialogBody';
import useDialog from 'components/V2/Dialog';
import useToast from 'components/V2/Toast';
import RichEditor from '../../../components/V2/Form/RichEditor';
import Select from '../../../components/V2/Form/Select';
import { ILanguageResource } from '../../../interfaces/ILanguage';
import { useEditableLanguage } from '../../../hooks/useEditableLanguage';

const EditReferralEmailTemplate = ({ id }: { id: string | number }) => {
  const t = useTranslate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { languages } = useSelector((state: any) => state.language);
  const [language, setLanguage] = useState(languages.length ? languages[0].id : null);
  const { data } = useOne(END_POINTS.EMAIL_TEMPLATE, id, { params: { lang: language } });
  const { mutate: update } = useUpdate(END_POINTS.EMAIL_TEMPLATE);
  const isEditableLanguage = useEditableLanguage(language);

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState: { isDirty }
  } = useForm<IEmailTemplateRequest>({
    defaultValues: {
      id: id,
      lang: language,
    }
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'lang' && type === 'change') {
        setLanguage(value.lang);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        content_type: data.content_type,
        content: data.content,
        lang: language,
      }, {
        keepDefaultValues: false,
      });
    }
  }, [data]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
    };

    update({ id, payload }, {
      onSuccess: (res) => {
        showToast({
          title: t('toast_title.edit_email_template'),
          message: t(res.message),
        });
        closeDialog();
      }
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Select
          label={t('common.language')}
          placeholder={t('placeholder.language')}
          control={control}
          name="lang"
          options={languages.map((language: ILanguageResource) => ({
            label: language.name,
            value: language.id,
          }))}
        />
        <Input
          disabled
          control={control}
          name="content_type"
          label={t('email_template.content_type')}
        />
        <Input
          control={control}
          name="title"
          label={t('common.title')}
          placeholder={t('placeholder.title')}
          rules={{ required: t('common.required.title') }}
          disabled={!isEditableLanguage}
        />
        <RichEditor
          control={control}
          label={t('email_template.content')}
          name="content"
          disabled={!isEditableLanguage}
        />
        <Form.Text id="contentHelpBlock" muted>
          #healthcare_worker_name# <br /> #rehab_service_admin_name# <br /> #therapist_name#
        </Form.Text>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit' disabled={!isDirty}>
          {t('common.save')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default EditReferralEmailTemplate;

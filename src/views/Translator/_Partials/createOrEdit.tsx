import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import Input from 'components/V2/Form/Input';
import Select from 'components/V2/Form/Select';
import { useTranslate } from 'hooks/useTranslate';
import { ILanguageResource } from 'interfaces/ILanguage';
import { ITranslatorRequest, ITranslatorResource } from 'interfaces/ITranslator';
import { useEffect, useMemo } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import useDialog from 'components/V2/Dialog';
import { useCreate } from 'hooks/useCreate';
import { useUpdate } from 'hooks/useUpdate';
import useToast from 'components/V2/Toast';

type CreateOrEditTranslatorProps = {
  translator: ITranslatorResource;
}

const CreateOrEditTranslator = ({ translator }: CreateOrEditTranslatorProps) => {
  const t: any = useTranslate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const languages = useSelector((state: any) => state.language.languages);
  const { control, handleSubmit, reset } = useForm<ITranslatorRequest>();
  const { mutate: createTranslator } = useCreate('translator');
  const { mutate: updateTranslator } = useUpdate('translator');

  useEffect(() => {
    if (translator) {
      reset({ ...translator, edit_language_ids: (translator.edit_languages ?? []).map((editLang) => editLang.id) });
    }
  }, [translator]);

  const languageOptions = useMemo(() => {
    return (languages ?? []).map((lang: ILanguageResource) => ({
      label: lang.name,
      value: lang.id,
    }));
  }, [languages]);

  const onSubmit = handleSubmit(async (data) => {
    if (translator) {
      updateTranslator({ id: translator.id, payload: data }, {
        onSuccess: (res) => {
          showToast({
            title: t('toast_title.edit_translator_account'),
            message: t(res.message),
          });
          closeDialog();
        }
      });
    } else {
      createTranslator(data, {
        onSuccess: (res) => {
          showToast({
            title: t('toast_title.new_translator_account'),
            message: t(res.message),
          });
          closeDialog();
        }
      });
    }
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Input
          control={control}
          label={t('common.email')}
          name='email'
          placeholder={t('placeholder.email')}
          disabled={!!translator}
          rules={{ required: t('error.email') }}
        />
        <Select
          control={control}
          name='edit_language_ids'
          label={t('translator.edit_languages')}
          options={languageOptions}
          isMulti
          placeholder={t('placeholder.edit_languages')}
          rules={{ required: t('error.edit_language') }}
        />
        <Form.Row>
          <Input
            as={Col}
            control={control}
            label={t('common.last_name')}
            name='last_name'
            placeholder={t('placeholder.last_name')}
            rules={{ required: t('error.last_name') }}
          />
          <Input
            as={Col}
            control={control}
            label={t('common.first_name')}
            name='first_name'
            placeholder={t('placeholder.first_name')}
            rules={{ required: t('error.first_name') }}
          />
        </Form.Row>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit'>
          {translator ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={() => closeDialog()}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateOrEditTranslator;

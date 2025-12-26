import DialogBody from 'components/V2/Dialog/DialogBody';
import Input from 'components/V2/Form/Input';
import Select from 'components/V2/Form/Select';
import { useTranslate } from 'hooks/useTranslate';
import { useEffect, useMemo } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import settings from 'settings';
import { File } from '../../../services/file';
import { IGuidanceRequest } from 'interfaces/IGuidance';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import useDialog from 'components/V2/Dialog';
import { useCreate } from 'hooks/useCreate';
import { END_POINTS } from 'variables/endPoint';
import { useOne } from 'hooks/useOne';
import { useUpdate } from 'hooks/useUpdate';
import useToast from 'components/V2/Toast';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { useEditableLanguage } from 'hooks/useEditableLanguage';

type CreateEditPhcWorkerGuidanceProps = {
  editId?: number;
}

const CreateEditPhcWorkerGuidance = ({ editId }: CreateEditPhcWorkerGuidanceProps) => {
  const dispatch = useDispatch();
  const t: any = useTranslate();
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { profile } = useSelector((state: any) => state.auth);
  const { languages } = useSelector((state: any) => state.language);
  const { mutate: createPhcWorkerGuidance } = useCreate(END_POINTS.GUIDANCE_PAGE);
  const { mutate: updatePhcWorkerGuidance } = useUpdate(END_POINTS.GUIDANCE_PAGE);
  const { control, handleSubmit, reset, watch } = useForm<IGuidanceRequest>({
    defaultValues: {
      lang: profile.language_id,
      target_role: 'phc_worker',
    }
  });
  const language = watch('lang');
  const isEditableLanguage = useEditableLanguage(language);
  const { data: phcWorkerGuidance } = useOne(END_POINTS.GUIDANCE_PAGE, editId!, { enabled: !!editId, params: { lang: language } });

  useEffect(() => {
    if (phcWorkerGuidance) {
      reset({
        ...phcWorkerGuidance,
        lang: language,
        target_role: 'phc_worker',
      });
    }
  }, [phcWorkerGuidance]);

  const languageOptions = useMemo(() => {
    return (languages ?? []).map((lang: any) => ({
      label: `${lang.name}${lang.code === lang.fallback ? ` (${t('common.default')})` : ''}`,
      value: lang.id
    }));
  }, [languages, t]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(showSpinner(true));
    if (editId) {
      updatePhcWorkerGuidance({ id: editId, payload: data }, {
        onSuccess: () => {
          showToast({
            title: t('phc_worker_guidance.toast.edit.title'),
            message: t('phc_worker_guidance.toast.edit.success'),
          });
          closeDialog();
        },
        onSettled: () => {
          dispatch(showSpinner(false));
        },
      });
    } else {
      createPhcWorkerGuidance(data, {
        onSuccess: () => {
          showToast({
            title: t('phc_worker_guidance.toast.create.title'),
            message: t('phc_worker_guidance.toast.create.success')
          });
          closeDialog();
        },
        onSettled: () => {
          dispatch(showSpinner(false));
        },
      });
    }
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Select
          control={control}
          isDisabled={!editId}
          name="lang"
          label={t('common.show_language.version')}
          options={languageOptions}
        />
        <Input
          control={control}
          name='title'
          label={t('common.title')}
          placeholder={t('placeholder.title')}
          rules={{ required: t('common.required.title') }}
          disabled={!isEditableLanguage}
        />
        <Form.Group controlId="content">
          <Form.Label>{t('common.content')}</Form.Label>
          <span className="text-dark ml-1">*</span>
          <Controller
            name="content"
            control={control}
            rules={{ required: t('common.required.content') }}
            render={({ field, fieldState }) => (
              <>
                <Editor
                  apiKey={settings.tinymce.apiKey}
                  value={field.value}
                  init={{
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    file_picker_callback: (cb: any) => {
                      const input = document.createElement('input');
                      input.setAttribute('type', 'file');
                      input.setAttribute('accept', 'image/*');
                      input.onchange = function (event: Event) {
                        const target = event.target as HTMLInputElement;
                        const file: any = target.files?.[0];

                        const reader = new FileReader();
                        reader.onload = async () => {
                          const base64 = reader.result;
                          const fileUpload = {
                            url: base64,
                            fileName: file.name,
                            fileSize: file.size,
                            fileType: file.type
                          };
                          const data = await File.upload(fileUpload);
                          if (data.success) {
                            const file = data.data;
                            const path = process.env.REACT_APP_API_BASE_URL + '/file/' + file.id;
                            cb(path, { title: file.filename });
                          }
                        };
                        reader.readAsDataURL(file);
                      };
                      input.click();
                    },
                    height: settings.tinymce.height,
                    plugins: settings.tinymce.plugins,
                    content_style: settings.tinymce.contentStyle,
                    toolbar: settings.tinymce.toolbar
                  }}
                  disabled={!isEditableLanguage}
                  onEditorChange={field.onChange}
                />
                {fieldState.error && (
                  <div className="invalid-feedback d-block">
                    {fieldState.error.message}
                  </div>
                )}
              </>
            )}
          />
        </Form.Group>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit' disabled={!isEditableLanguage}>
          {editId ? t('common.save') : t('common.create')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default CreateEditPhcWorkerGuidance;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { useFieldArray } from 'react-hook-form';
import { Button, Card } from 'react-bootstrap';
import { BsPlusCircle, BsTrash } from 'react-icons/bs';
import { useEditableLanguage } from '../../../../../hooks/useEditableLanguage';
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES } from '../../../../../variables/questionnaire';
import Input from '../../../../../components/V2/Form/Input';
import QuestionRepeater from '../QuestionRepeater';
import ActionRepeater from '../ActionRepeater';
import Dialog from '../../../../../components/Dialog';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES.sections[0];

const SectionRepeater = ({
  control,
  setValue,
  watch,
  untranslatable,
  isDraft
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const isEditableLanguage = useEditableLanguage(watch('lang'));

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  const [showConfrimDeleteSection, setShowConfirmDeleteSection] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);
  const disableRemoveSection = (index) => {
    const sections = watch('sections') ?? [];
    const section = sections[index];

    if (isDraft) return sections.length <= 1;
    return sections.length <= 1 || typeof section?.id === 'number';
  };

  const handleRemoveSection = (index) => {
    setShowConfirmDeleteSection(true);
    setRemoveIndex(index);
  };
  const handleCancelRemoveSection = () => {
    setShowConfirmDeleteSection(false);
    setRemoveIndex(null);
  };
  const handleConfirmRemoveSection = () => {
    if (removeIndex === null) return;
    remove(removeIndex);
    setShowConfirmDeleteSection(false);
    setRemoveIndex(null);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Card key={field.id} className="question-card mb-3">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">
                {translate('questionnaire.section_number', { number: index + 1 })}
              </Card.Title>
              <Button
                aria-label="Remove Section"
                variant="link"
                size="sm"
                className="text-danger px-0"
                disabled={disableRemoveSection(index)}
                onClick={() => handleRemoveSection(index)}
              >
                <BsTrash size={20} />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Input
              control={control}
              name={`sections.${index}.title`}
              label="Title"
              placeholder={translate('questionnaire.title.placeholder')}
              disabled={!isEditableLanguage}
              rules={{ required: translate('questionnaire.title.required') }}
            />
            <QuestionRepeater
              sectionIndex={index}
              control={control}
              setValue={setValue}
              watch={watch}
              untranslatable={untranslatable}
              isDraft={isDraft}
            />
          </Card.Body>
          <ActionRepeater
            sectionIndex={index}
            control={control}
            watch={watch}
            untranslatable={untranslatable}
          />
        </Card>
      ))}
      <Button
        aria-label="Add Section"
        className="px-0"
        variant="link"
        disabled={untranslatable}
        onClick={() => append(defaultValues)}
      >
        <BsPlusCircle size={20} /> {translate('questionnaire.new.section')}
      </Button>
      <Dialog
        show={showConfrimDeleteSection}
        title={translate('screening_questionnaire.delete_section')}
        cancelLabel={translate('common.no')}
        onCancel={handleCancelRemoveSection}
        confirmLabel={translate('common.yes')}
        onConfirm={handleConfirmRemoveSection}
      >
        <p>{translate('screening_questionnaire.delete_section_confirmation_message')}</p>
      </Dialog>
    </>
  );
};

SectionRepeater.propTypes = {
  control: PropTypes.object,
  setValue: PropTypes.func,
  watch: PropTypes.func,
  untranslatable: PropTypes.bool,
  isDraft: PropTypes.bool,
};

export default withLocalize(SectionRepeater);

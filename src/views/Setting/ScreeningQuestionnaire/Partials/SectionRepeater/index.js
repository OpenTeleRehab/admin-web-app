import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { useFieldArray } from 'react-hook-form';
import { Button, Card } from 'react-bootstrap';
import { BsPlusCircle, BsTrash } from 'react-icons/bs';
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES } from '../../../../../variables/questionnaire';
import Input from '../../../../../components/V2/Form/Input';
import QuestionRepeater from '../QuestionRepeater';
import ActionRepeater from '../ActionRepeater';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES.sections[0];

const SectionRepeater = ({
  control,
  setValue,
  watch,
  disabled,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  const disableRemoveSection = (index) => {
    const sections = watch('sections');
    const section = sections[index];

    return sections.length <= 1 || typeof section?.id === 'number';
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
                onClick={() => remove(index)}
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
              rules={{ required: translate('questionnaire.title.required') }}
              disabled={disabled}
            />
            <QuestionRepeater
              sectionIndex={index}
              control={control}
              setValue={setValue}
              watch={watch}
              disabled={disabled}
            />
          </Card.Body>
          <ActionRepeater
            sectionIndex={index}
            control={control}
            watch={watch}
          />
        </Card>
      ))}
      <Button
        aria-label="Add Section"
        className="px-0"
        variant="link"
        onClick={() => append(defaultValues)}
      >
        <BsPlusCircle size={20} /> {translate('questionnaire.new.section')}
      </Button>
    </>
  );
};

SectionRepeater.propTypes = {
  control: PropTypes.object,
  setValue: PropTypes.func,
  watch: PropTypes.func,
  disabled: PropTypes.bool,
};

export default withLocalize(SectionRepeater);

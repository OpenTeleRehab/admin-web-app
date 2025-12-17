import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { useFieldArray } from 'react-hook-form';
import { Button, Card } from 'react-bootstrap';
import { BsPlusCircle, BsTrash } from 'react-icons/bs';
import Input from '../../../../../components/V2/Form/Input';
import QuestionRepeater from '../QuestionRepeater';

const SectionRepeater = ({
  defaultValue,
  control,
  watch,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  const handleAddSection = () => {
    append(defaultValue);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Card key={index} className="question-card mb-3">
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
                disabled={fields.length <= 1}
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
            />
            <QuestionRepeater
              defaultValue={defaultValue.questions[0]}
              sectionIndex={index}
              control={control}
              watch={watch}
            />
          </Card.Body>
        </Card>
      ))}
      <Button
        aria-label="Add Section"
        className="px-0"
        variant="link"
        onClick={handleAddSection}
      >
        <BsPlusCircle size={20} /> {translate('questionnaire.new.section')}
      </Button>
    </>
  );
};

SectionRepeater.propTypes = {
  defaultValue: PropTypes.object,
  control: PropTypes.object,
  watch: PropTypes.func,
};

export default withLocalize(SectionRepeater);

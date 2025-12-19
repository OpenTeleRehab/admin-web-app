import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import { Button } from 'react-bootstrap';
import { BsPlusCircle } from 'react-icons/bs';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES } from '../../../../../variables/questionnaire';
import QuestionItem from '../QuestionItem';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES.sections[0].questions[0];

const QuestionRepeater = ({
  sectionIndex,
  control,
  watch,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  const handleAddQuestion = () => {
    append({
      ...defaultValues,
      id: crypto.randomUUID(),
    });
  };

  return (
    <>
      {fields.map((field, item) => (
        <QuestionItem
          key={item}
          sectionIndex={sectionIndex}
          questionIndex={item}
          control={control}
          watch={watch}
          onRemove={() => remove(item)}
        />
      ))}
      <Button
        aria-label="Add Question"
        className="px-0"
        variant="link"
        onClick={handleAddQuestion}
      >
        <BsPlusCircle size={20} /> {translate('questionnaire.new.question')}
      </Button>
    </>
  );
};

QuestionRepeater.propTypes = {
  sectionIndex: PropTypes.number,
  control: PropTypes.object,
  watch: PropTypes.func,
};

export default withLocalize(QuestionRepeater);

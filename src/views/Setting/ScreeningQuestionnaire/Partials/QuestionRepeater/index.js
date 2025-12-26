import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import { Button } from 'react-bootstrap';
import { BsPlusCircle } from 'react-icons/bs';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES } from '../../../../../variables/questionnaire';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import QuestionItem from '../QuestionItem';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES.sections[0].questions[0];

const QuestionRepeater = ({
  sectionIndex,
  control,
  setValue,
  watch,
  disabled,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const questions = watch(`sections.${sectionIndex}.questions`);

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  const handleAddQuestion = () => {
    append({
      ...defaultValues,
      id: crypto.randomUUID(),
      options: [
        {
          ...defaultValues.options[0],
          id: crypto.randomUUID(),
        },
        {
          ...defaultValues.options[1],
          id: crypto.randomUUID(),
        }
      ]
    });
  };

  const handleCloneQuestion = (questionIndex) => {
    const question = watch(`sections.${sectionIndex}.questions.${questionIndex}`);

    const cloneQuestion = {
      ...question,
      id: crypto.randomUUID(),
      file: null,
      options: question.options.map(option => ({
        ...option,
        id: crypto.randomUUID(),
        file: null,
      })),
      logics: question.logics.map(logic => ({
        ...logic,
        id: crypto.randomUUID(),
      })),
    };

    append(cloneQuestion);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    // Prevent dropping in disabled
    if (typeof questions[destination.index].id === 'number') {
      return;
    }

    // Reset logics
    setValue(`sections.${sectionIndex}.questions.${source.index}.logics`, []);

    move(source.index, destination.index);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((field, index) => (
                <Draggable
                  key={field.id}
                  draggableId={field.id}
                  index={index}
                  isDragDisabled={questions.length <= 1 || typeof questions[index].id === 'number'}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <QuestionItem
                        sectionIndex={sectionIndex}
                        questionIndex={index}
                        provided={provided}
                        control={control}
                        setValue={setValue}
                        watch={watch}
                        onClone={handleCloneQuestion}
                        onRemove={() => remove(index)}
                        disabled={disabled}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        aria-label="Add Question"
        className="px-0"
        variant="link"
        onClick={handleAddQuestion}
        disabled={disabled}
      >
        <BsPlusCircle size={20} /> {translate('questionnaire.new.question')}
      </Button>
    </>
  );
};

QuestionRepeater.propTypes = {
  sectionIndex: PropTypes.number,
  control: PropTypes.object,
  setValue: PropTypes.func,
  watch: PropTypes.func,
  disabled: PropTypes.bool,
};

export default withLocalize(QuestionRepeater);

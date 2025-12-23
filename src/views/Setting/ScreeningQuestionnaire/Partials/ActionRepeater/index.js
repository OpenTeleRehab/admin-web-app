import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { useFieldArray } from 'react-hook-form';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { BsPlusCircle, BsX } from 'react-icons/bs';
import { DEFAULT_SCREENING_QUESTIONNAIRE_VALUES } from '../../../../../variables/questionnaire';
import Input from '../../../../../components/V2/Form/Input';

const defaultValues = DEFAULT_SCREENING_QUESTIONNAIRE_VALUES.sections[0].actions[0];

const ActionRepeater = ({
  sectionIndex,
  control,
  watch,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.actions`,
  });

  const disableAddAction = () => {
    const actions = watch(`sections.${sectionIndex}.actions`);

    if (actions?.length) {
      const action = actions.at(-1);

      if (parseInt(action.to) >= getTotalPoints()) {
        return true;
      }
    }

    return false;
  };

  const getTotalPoints = () => {
    const section = watch(`sections.${sectionIndex}`);

    let total = 0;

    if (section) {
      section.questions.forEach((question) => {
        question.options.forEach((option) => {
          if (option.option_point) {
            total += parseInt(option.option_point);
          } else if (option.min && option.max) {
            total += parseInt(option.max);
          } else {
            total += 0;
          }
        });
      });
    }

    return total;
  };

  const getInitMinValue = (index) => {
    if (index > 0) {
      const previousToValue = watch(`sections.${sectionIndex}.actions.${index - 1}.to`);

      if (previousToValue) {
        return parseInt(previousToValue) + 1;
      }
    }

    return 0;
  };

  const getEndMinValue = (index) => {
    const fromValue = watch(`sections.${sectionIndex}.actions.${index}.from`);

    if (fromValue) {
      return parseInt(fromValue) + 1;
    }

    return 0;
  };

  return (
    <Card.Footer>
      <Card className="question-card mb-2">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title className="mb-0">
              {translate('common.actions')}
            </Card.Title>
            <strong>{translate('question.point')}: {getTotalPoints(sectionIndex)}</strong>
          </div>
        </Card.Header>
        <Card.Body>
          {fields.map((field, index) => (
            <Row key={field.id}>
              <Col xs={3} lg={3}>
                <Input
                  control={control}
                  name={`sections.${sectionIndex}.actions.${index}.from`}
                  type="number"
                  min={getInitMinValue(index)}
                  placeholder={translate('screening_questionnaire.action.from.placeholder')}
                  rules={{
                    required: translate('screening_questionnaire.action.from.required'),
                    min: {
                      value: getInitMinValue(index),
                      message: translate('screening_questionnaire.action.min.validate', { min: getInitMinValue(index) }),
                    },
                    max: {
                      value: getTotalPoints(index) - 1,
                      message: translate('screening_questionnaire.action.max.validate', { max: getTotalPoints(index) - 1 }),
                    }
                  }}
                />
              </Col>
              <Col xs={3} lg={3}>
                <Input
                  control={control}
                  name={`sections.${sectionIndex}.actions.${index}.to`}
                  type="number"
                  min={getEndMinValue(index)}
                  placeholder={translate('screening_questionnaire.action.to.placeholder')}
                  rules={{
                    required: translate('screening_questionnaire.action.to.required'),
                    min: {
                      value: getEndMinValue(index),
                      message: translate('screening_questionnaire.action.min.validate', { min: getEndMinValue(index) }),
                    },
                    max: {
                      value: getTotalPoints(index),
                      message: translate('screening_questionnaire.action.max.validate', { max: getTotalPoints(index) }),
                    }
                  }}
                />
              </Col>
              <Col xs={3} lg={3}>
                <Input
                  control={control}
                  name={`sections.${sectionIndex}.actions.${index}.action_text`}
                  placeholder={translate('screening_questionnaire.action.action_text.placeholder')}
                  rules={{
                    required: translate('screening_questionnaire.action.action_text.required'),
                  }}
                />
              </Col>
              <Col xs={2} lg={2}>
                <Button
                  aria-label="Remove action"
                  variant="outline-danger"
                  className="remove-btn d-flex align-items-center justify-content-center mt-1"
                  disabled={index < fields.length - 1}
                  onClick={() => remove(index)}
                >
                  <BsX size={16} />
                </Button>
              </Col>
            </Row>
          ))}
        </Card.Body>
        <Card.Footer>
          <Button
            aria-label="Add action"
            className="px-0"
            variant="link"
            disabled={disableAddAction()}
            onClick={() => append(defaultValues)}
          >
            <BsPlusCircle size={20} /> {translate('screening_questionnaire.add_more_action')}
          </Button>
        </Card.Footer>
      </Card>
    </Card.Footer>
  );
};

ActionRepeater.propTypes = {
  sectionIndex: PropTypes.number,
  control: PropTypes.object,
  watch: PropTypes.func,
};

export default withLocalize(ActionRepeater);

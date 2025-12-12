import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, CloseButton, Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import { getTranslate, withLocalize } from 'react-localize-redux';
import { useFieldArray } from 'react-hook-form';
import Select from '../../../../../components/V2/Form/Select';
import { BsFillGearFill, BsPlus, BsX } from 'react-icons/bs';

const QuestionSetting = ({
  question,
  control,
  onClose,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const { fields, append, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'sections.0.questions.0.options',
  });

  return (
    <div className="question-setting-popover">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <BsFillGearFill size={20} /> <span className="ml-2">{translate('setting')}</span>
        </div>
        <CloseButton
          aria-label="Close question setting"
          onClick={() => onClose(false)}
        />
      </div>
      <Tab.Container defaultActiveKey="skip_logic">
        <Row>
          <Col md={2}>
            <Nav variant="pills" className="flex-column mx-0">
              <Nav.Item>
                <Nav.Link eventKey="skip_logic">
                  {translate('question.skip_logic')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={10}>
            <Tab.Content>
              <p>This question will only be displayed if the following condition apply.</p>

              <Tab.Pane eventKey="skip_logic">
                {fields.map((field, index) => (
                  <Row key={index}>
                    <Col lg={4}>
                      <Select
                        control={control}
                        name="target_question_id"
                        placeholder={translate('questionnaire.select_question.placeholder')}
                        options={[
                          { value: '1', label: 'Question 1' },
                          { value: '2', label: 'Question 2' },
                        ]}
                      />
                    </Col>
                    <Col lg={4}>
                      <Select
                        control={control}
                        name="condition"
                        options={[
                          { value: '1', label: 'Was answered' },
                          { value: '2', label: 'Was not answered' },
                          { value: '3', label: 'Equal' },
                          { value: '4', label: 'Not equal' },
                        ]}
                      />
                    </Col>
                    <Col lg={4}>
                      <Select
                        control={control}
                        name="condition"
                        options={[]}
                      />
                    </Col>
                  </Row>
                ))}
                <Button
                  aria-label="Add another condition"
                  onClick={() => {}}
                >
                  <BsPlus size={16} /> Add another condition
                </Button>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

QuestionSetting.propTypes = {
  question: PropTypes.object,
  control: PropTypes.object,
  onClose: PropTypes.func,
};

export default withLocalize(QuestionSetting);

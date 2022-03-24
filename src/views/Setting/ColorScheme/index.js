import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form, Row
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { SketchPicker } from 'react-color';
import {
  createColorScheme,
  getColorScheme
} from 'store/colorScheme/actions';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';

const ColorScheme = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);

  const { colorScheme } = useSelector(state => state.colorScheme);

  const [formFields, setFormFields] = useState({
    primary_color: '#0077C8',
    secondary_color: '#06038D'
  });

  useEffect(() => {
    dispatch(getColorScheme());
  }, [dispatch]);

  useEffect(() => {
    if (colorScheme.id) {
      setFormFields({
        primary_color: colorScheme.primary_color || '#0077C8',
        secondary_color: colorScheme.secondary_color || '#06038D'
      });
    }
  }, [colorScheme]);

  const handlePrimaryColorChange = (color, editor) => {
    setFormFields({ ...formFields, primary_color: color.hex });
    setDisabled(false);
  };

  const handleSecondaryColorChange = (color, editor) => {
    setFormFields({ ...formFields, secondary_color: color.hex });
    setDisabled(false);
  };

  const handleConfirm = () => {
    dispatch(createColorScheme({ ...formFields })).then(result => {
      if (result) {
        setDisabled(true);
      }
    });
  };

  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <>
      <Form onKeyPress={(e) => handleFormSubmit(e)}>
        <Form.Group as={Row} controlId="primaryColor" className="col-md-6">
          <Form.Label column sm="4">{translate('common.primary_color')}</Form.Label>
          <Col sm="8">
            <SketchPicker
              onChange={handlePrimaryColorChange}
              color={formFields.primary_color}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="secondaryColor" className="col-md-6">
          <Form.Label column sm="4">{translate('common.secondary_color')}</Form.Label>
          <Col sm="8">
            <SketchPicker
              onChange={handleSecondaryColorChange}
              color={formFields.secondary_color}
            />
          </Col>
        </Form.Group>
        <Row>
          <Col sm={12} xl={11} className="question-wrapper">
            <div className="sticky-btn d-flex justify-content-end">
              <div className="py-2 questionnaire-save-cancel-wrapper px-3">
                <Button
                  id="formSave"
                  onClick={handleConfirm}
                  className="pl-lg-5 pr-lg-5"
                  disabled={disabled}
                >
                  {translate('common.save')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default ColorScheme;

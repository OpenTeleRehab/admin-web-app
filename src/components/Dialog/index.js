import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

const Dialog = (props) => {
  const {
    show,
    title,
    onConfirm,
    onCancel,
    cancelLabel,
    confirmLabel,
    disabled,
    children,
    ...rest
  } = props;

  return (
    <Modal
      show={show}
      onHide={onCancel}
      backdrop="static"
      {...rest}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-break">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>
        {onConfirm &&
          <Button variant="primary" onClick={onConfirm} disabled={disabled}>
            {confirmLabel}
          </Button>
        }
        <Button variant="outline-dark" onClick={onCancel} disabled={disabled}>
          {cancelLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

Dialog.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

Dialog.defaultProps = {
  confirmLabel: <Translate id="common.create"/>,
  cancelLabel: <Translate id="common.cancel"/>,
  disabled: false
};

export default Dialog;

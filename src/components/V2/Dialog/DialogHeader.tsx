import React from 'react';
import { Modal } from 'react-bootstrap';

type DialogHeaderProps = {
  children: React.ReactNode;
  className?: string;
}

const DialogHeader = ({ children, className }: DialogHeaderProps) => {
  return (
    <Modal.Header className={className!}>
      {children}
    </Modal.Header>
  );
};

export default DialogHeader;

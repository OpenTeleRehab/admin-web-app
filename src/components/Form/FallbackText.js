import React from 'react';
import PropTypes from 'prop-types';

const FallbackText = ({ translate, text }) => {
  return (
    <span className="d-block mb-2">{translate('common.english')}: {text}</span>
  );
};

FallbackText.propTypes = {
  translate: PropTypes.func,
  text: PropTypes.string
};

export default FallbackText;

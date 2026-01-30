import React from 'react';
import PropTypes from 'prop-types';

const QuestionText = ({ questionText, required }: { questionText: string, required?: boolean }) => {
  return (
    <div className='mb-2'>
      <span dangerouslySetInnerHTML={{ __html: questionText }} />
      {required && <span className="text-danger ml-1">*</span>}
    </div>
  );
};

QuestionText.propTypes = {
  questionText: PropTypes.string,
  required: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

export default QuestionText;

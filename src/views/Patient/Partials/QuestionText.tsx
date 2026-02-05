import React from 'react';

const QuestionText = ({ questionText, required }: { questionText: string, required?: number | boolean }) => {
  const isRequired = required === true || required === 1;

  return (
    <div className='mb-2'>
      <span dangerouslySetInnerHTML={{ __html: questionText }}/>
      {isRequired && <span className="text-danger ml-1">*</span>}
    </div>
  );
};

export default QuestionText;

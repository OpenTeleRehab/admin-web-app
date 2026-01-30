export const getQuestionName = (id:number) => `question_${id}`;

export const evaluateLogic = (logic:any, value:any) => {
  if (!logic || value === undefined || value === null) return false;

  const { operator, value: targetValue } = logic;

  switch (operator) {
    case '=':
    case '==':
      // eslint-disable-next-line eqeqeq
      return value == targetValue;
    case '!=':
      // eslint-disable-next-line eqeqeq
      return value != targetValue;
    case '>':
      return Number(value) > Number(targetValue);
    case '>=':
      return Number(value) >= Number(targetValue);
    case '<':
      return Number(value) < Number(targetValue);
    case '<=':
      return Number(value) <= Number(targetValue);
    case 'in':
      return Array.isArray(targetValue) && targetValue.includes(value);
    case 'not_in':
      return Array.isArray(targetValue) && !targetValue.includes(value);
    default:
      return false;
  }
};

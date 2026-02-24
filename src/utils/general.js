export const preventInvalidNumberInput = (e) => {
  if (e.key === '-' || e.key === 'e') {
    e.preventDefault();
  }
};

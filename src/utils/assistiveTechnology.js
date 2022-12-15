import _ from 'lodash';

export const getAssistiveTechnologyName = (ids, assistiveTechnologies) => {
  const assistiveTechnologyIds = ids.split(',').map(Number);
  const assistiveTechnologyData = _.filter(assistiveTechnologies, (at) => _.includes(assistiveTechnologyIds, at.id));
  const assistiveTechnologyNames = _.map(assistiveTechnologyData, 'name');

  return assistiveTechnologyNames && assistiveTechnologyNames.join(', ');
};

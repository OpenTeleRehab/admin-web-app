import _ from 'lodash';

export const getPhcServiceName = (id, phcServices) => {
  const phcService = _.findLast(phcServices, { id: parseInt(id, 10) });

  return phcService ? phcService.name : '';
};

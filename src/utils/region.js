import _ from 'lodash';

export const getRegionName = (id, regions) => {
  const region = _.findLast(regions, { id: parseInt(id, 10) });

  return region ? region.name : '';
};

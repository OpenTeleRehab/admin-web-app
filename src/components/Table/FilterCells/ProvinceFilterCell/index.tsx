import { useState } from 'react';
import Select from 'react-select';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { IProvinceResource } from 'interfaces/IProvince';
import { useTranslate } from 'hooks/useTranslate';

const ProvinceFilterCell = ({ onFilter } : { onFilter: (value: any) => void }) => {
  const [province, setProvince] = useState<number | string>('');
  const { data: provinces } = useList<IProvinceResource>(END_POINTS.PROVINCE_BY_REGION);
  const t = useTranslate();

  const customSelectStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white'
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
  };

  const handleFilter = (value: number | string) => {
    setProvince(value);
    onFilter(value === '' ? null : { value });
  };

  const options = [
    { id: '', name: t('common.all') },
    ...(provinces?.data || []),
  ];

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={options.filter(item => item.id === province)}
        getOptionLabel={option => option.name}
        options={options}
        onChange={(e) => handleFilter(e ? e.id : '')}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Province"
      />
    </th>
  );
};

export default ProvinceFilterCell;

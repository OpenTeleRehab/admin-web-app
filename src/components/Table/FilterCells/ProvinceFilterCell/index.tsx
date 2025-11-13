import { useState } from 'react';
import Select from 'react-select';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { IProvinceResource } from 'interfaces/IProvince';

const ProvinceFilterCell = ({ onFilter } : { onFilter: (value: any) => void }) => {
  const [province, setProvince] = useState(0);
  const { data: provinces } = useList<IProvinceResource>(END_POINTS.PROVINCE_BY_REGION);

  const customSelectStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white'
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
  };

  const handleFilter = (value: number) => {
    setProvince(value);
    onFilter(value === 0 ? null : { value });
  };

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={(provinces?.data || []).filter(item => item.id === province)}
        getOptionLabel={option => option.name}
        options={provinces?.data || []}
        onChange={(e) => handleFilter(e ? Number(e.id) : 0)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Province"
      />
    </th>
  );
};

export default ProvinceFilterCell;

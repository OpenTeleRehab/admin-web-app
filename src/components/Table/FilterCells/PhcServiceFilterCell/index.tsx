import { useState } from 'react';
import Select from 'react-select';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { IPHCService } from 'interfaces/IPHCService';

const PhcServiceFilterCell = ({ onFilter } : { onFilter: (value: any) => void }) => {
  const [phcService, setPhcService] = useState(0);
  const { data: phcServices } = useList<IPHCService>(END_POINTS.PHC_SERVICES_BY_REGION);

  const customSelectStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white'
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
  };

  const handleFilter = (value: number) => {
    setPhcService(value);
    onFilter(value === 0 ? null : { value });
  };

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={(phcServices?.data || []).filter(item => item.id === phcService)}
        getOptionLabel={option => option.name}
        options={phcServices?.data || []}
        onChange={(e) => handleFilter(e ? Number(e.id) : 0)}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="PHC Service"
      />
    </th>
  );
};

export default PhcServiceFilterCell;

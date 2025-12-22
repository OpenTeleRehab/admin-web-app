import { useState } from 'react';
import Select from 'react-select';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { IPHCService } from 'interfaces/IPHCService';
import { useTranslate } from 'hooks/useTranslate';

const PhcServiceFilterCell = ({ onFilter } : { onFilter: (value: any) => void }) => {
  const [phcService, setPhcService] = useState<number | string>('');
  const { data: phcServices } = useList<IPHCService>(END_POINTS.PHC_SERVICES_BY_REGION);
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
    setPhcService(value);
    onFilter(value === '' ? null : { value });
  };

  const options = [
    { id: '', name: t('common.all') },
    ...(phcServices?.data || []),
  ];

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={options.filter(item => item.id === phcService)}
        getOptionLabel={option => option.name}
        options={options}
        onChange={(e) => handleFilter(e ? e.id : '')}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="PHC Service"
      />
    </th>
  );
};

export default PhcServiceFilterCell;

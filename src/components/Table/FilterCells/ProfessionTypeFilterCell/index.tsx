import { useTranslate } from 'hooks/useTranslate';
import { useState } from 'react';
import Select from 'react-select';
import { PROFESSION_TYPES } from 'variables/professionTypes';

const ProfessionTypeFilterCell = ({ onFilter } : { onFilter: (value: any) => void }) => {
  const [type, setType] = useState('');
  const t = useTranslate();

  const customSelectStyles = {
    option: (provided: any) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white'
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 1000 })
  };

   const typeData: { value: string; label: string }[] = [
    {
      value: '',
      label: 'common.all'
    },
    ...PROFESSION_TYPES
  ];

  const handleFilter = (value: string) => {
    setType(value);
    onFilter(value === '' ? null : { value });
  };

  return (
    <th>
      <Select
        classNamePrefix="filter"
        value={typeData.filter(item => item.value === type)}
        getOptionLabel={option => t(option.label)}
        options={typeData}
        onChange={(e) => handleFilter(e ? e.value : '')}
        menuPortalTarget={document.body}
        styles={customSelectStyles}
        aria-label="Profession Type"
      />
    </th>
  );
};

export default ProfessionTypeFilterCell;

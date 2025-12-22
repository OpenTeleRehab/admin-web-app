import { useState } from 'react';
import Select from 'react-select';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { IRegionResource } from 'interfaces/IRegion';
import { useTranslate } from 'hooks/useTranslate';

const RegionFilterCell = ({ onFilter } : { onFilter: (value: any) => void }) => {
    const [region, setRegion] = useState<number | string>('');
    const { data: regions } = useList<IRegionResource>(END_POINTS.REGION);
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
        setRegion(value);
        onFilter(value === '' ? null : { value });
    };

    const options = [
        { id: '', name: t('common.all') },
        ...(regions?.data || []),
    ];

    return (
        <th>
            <Select
                classNamePrefix="filter"
                value={options.filter(item => item.id === region)}
                getOptionLabel={option => option.name}
                options={options}
                onChange={(e) => handleFilter(e ? e.id : '')}
                menuPortalTarget={document.body}
                styles={customSelectStyles}
                aria-label="Region"
            />
        </th>
    );
};

export default RegionFilterCell;

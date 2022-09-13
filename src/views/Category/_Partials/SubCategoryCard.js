import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Card } from 'react-bootstrap';
import { BsPlus } from 'react-icons/all';
import SubCategoryList from './subCategoryList';
import { useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import SearchInput from 'components/Form/SearchInput';
import { USER_GROUPS, USER_ROLES } from '../../../variables/user';
import keycloak from '../../../utils/keycloak';

const SubCategoryCard = ({ type, activeCategory, categories, active, setActive, handleCreate, handleEdit }) => {
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector((state) => state.auth);
  const translate = getTranslate(localize);
  const [searchValue, setSearchValue] = useState('');

  const [subCategories, setSubCategories] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);

  // Set the current sub-categories
  useEffect(() => {
    if (activeCategory && categories.length) {
      setSubCategories(_.filter(categories, { parent: activeCategory.id }));
    }
  }, [activeCategory, categories]);

  // Filter categories by search value
  useEffect(() => {
    const value = searchValue.trim();
    if (value !== '') {
      setSearchCategories(_.filter(subCategories, c => {
        return c.title.toLowerCase().search(value.toLowerCase()) !== -1;
      }));
    } else {
      setSearchCategories(subCategories);
    }
  }, [subCategories, searchValue]);

  if (!activeCategory) {
    return (
      <Card>
        <Card.Header />
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="pl-4 d-flex justify-content-between align-items-start">
        <h5 className="m-0 text-truncate">{activeCategory.title}</h5>
        { profile.type !== USER_GROUPS.ORGANIZATION_ADMIN && !keycloak.hasRealmRole(USER_ROLES.TRANSLATE_CATEGORY) &&
          <Button
            aria-label="Create category"
            variant="outline-primary"
            className="btn-circle"
            onClick={() => handleCreate(activeCategory.id, false)}
          >
            <BsPlus size={20} />
          </Button>
        }
      </Card.Header>
      {subCategories.length > 0 && (
        <Card.Body className="px-2">
          <SearchInput
            name="search_value"
            value={searchValue}
            placeholder={translate('category.search_sub_category')}
            onChange={e => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
          />
          <strong>
            {translate('category.number_of_sub_categories', { number: searchCategories.length })}
          </strong>
          <SubCategoryList
            subCategories={searchCategories}
            categories={categories}
            active={active}
            setActive={setActive}
            handleEdit={handleEdit}
            type={type}
          />
        </Card.Body>
      )}
    </Card>
  );
};

SubCategoryCard.propTypes = {
  type: PropTypes.string,
  activeCategory: PropTypes.object,
  categories: PropTypes.array,
  active: PropTypes.object,
  setActive: PropTypes.func,
  handleCreate: PropTypes.func,
  handleEdit: PropTypes.func
};

export default SubCategoryCard;

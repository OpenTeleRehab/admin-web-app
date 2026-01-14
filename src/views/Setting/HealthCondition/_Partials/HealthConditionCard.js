import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Card } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import SearchInput from 'components/Form/SearchInput';
import { getHealthConditions } from '../../../../store/healthCondition/actions';
import customColorScheme from '../../../../utils/customColorScheme';
import CreateHealthCondition from './CreateHealthCondition';
import HealthConditionList from './HealthConditionList';
import { useKeycloak } from '@react-keycloak/web';
import { USER_ROLES } from 'variables/user';

const HealthConditionCard = ({ activeHealthConditionGroup, active, setActive }) => {
  const { colorScheme } = useSelector(state => state.colorScheme);
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { keycloak } = useKeycloak();
  const { healthConditions } = useSelector((state) => state.healthCondition);
  const [searchValue, setSearchValue] = useState('');
  const [searchHealthConditions, setSearchHealthConditions] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');

  // Set the current health conditions
  useEffect(() => {
    if (activeHealthConditionGroup) {
      dispatch(getHealthConditions({ parent_id: activeHealthConditionGroup.id }));
    }
  }, [dispatch, activeHealthConditionGroup]);

  // Filter health conditions by search value
  useEffect(() => {
    const value = searchValue.trim();
    if (value !== '') {
      setSearchHealthConditions(_.filter(healthConditions, c => {
        return c.title.toLowerCase().search(value.toLowerCase()) !== -1;
      }));
    } else {
      setSearchHealthConditions(healthConditions);
    }
  }, [healthConditions, searchValue]);

  const handleClose = () => {
    setEditId('');
    setShow(false);
  };

  const handleCreate = () => {
    setShow(true);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShow(true);
  };

  if (!activeHealthConditionGroup) {
    return (
      <Card>
        <Card.Header />
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="pl-4 d-flex justify-content-between align-items-start">
          <h5 className="m-0 text-truncate">{activeHealthConditionGroup.title}</h5>
          <Button
            aria-label={translate('setting.health_condition.new')}
            variant="outline-primary"
            className="btn-circle"
            disabled={!keycloak.hasRealmRole(USER_ROLES.MANAGE_HEALTH_CONDITION)}
            onClick={() => handleCreate(activeHealthConditionGroup.id, false)}
          >
            <BsPlus size={20} />
          </Button>
        </Card.Header>
        {healthConditions.length > 0 && (
          <Card.Body className="px-2">
            <SearchInput
              name="search_value"
              value={searchValue}
              placeholder={translate('setting.health_condition.search_health_conditions')}
              onChange={e => setSearchValue(e.target.value)}
              onClear={() => setSearchValue('')}
            />
            <strong>
              {translate('setting.health_condition.number_of_health_conditions', { number: searchHealthConditions.length })}
            </strong>
            <HealthConditionList
              resultHealthConditions={searchHealthConditions}
              healthConditions={healthConditions}
              active={active}
              setActive={setActive}
              handleEdit={handleEdit}
            />
          </Card.Body>
        )}
      </Card>
      {show && (
        <CreateHealthCondition
          show={show}
          editId={editId}
          handleClose={handleClose}
          activeHealthConditionGroup={activeHealthConditionGroup}
        />
      )}
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

HealthConditionCard.propTypes = {
  activeHealthConditionGroup: PropTypes.object,
  active: PropTypes.object,
  setActive: PropTypes.func
};

export default HealthConditionCard;

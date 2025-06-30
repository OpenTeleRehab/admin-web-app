import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardGroup } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import _ from 'lodash';

import HealthConditionGroupList from './_Partials/HealthConditionGroupList';
import CreateHealthConditionGroup from './_Partials/CreateHealthConditionGroup';
import HealthConditionCard from './_Partials/HealthConditionCard';
import SearchInput from 'components/Form/SearchInput';
import { getHealthConditionGroups } from 'store/healthConditionGroup/actions';
import customColorScheme from '../../../utils/customColorScheme';

const HealthCondition = ({ translate }) => {
  const dispatch = useDispatch();
  const { healthConditionGroups } = useSelector((state) => state.healthConditionGroup);
  const { colorScheme } = useSelector(state => state.colorScheme);

  const [editId, setEditId] = useState('');
  const [show, setShow] = useState(false);
  const [activeSub1, setActiveSub1] = useState(undefined);
  const [activeSub2, setActiveSub2] = useState(undefined);
  const [searchValue, setSearchValue] = useState('');
  const [resultHealthConditionGroups, setResultHealthConditionGroups] = useState([]);

  // Fetch healthConditionGroup data
  useEffect(() => {
    dispatch(getHealthConditionGroups());
    setActiveSub1(undefined);
    setActiveSub2(undefined);
  }, [dispatch]);

  // Filter health condition groups by search value
  useEffect(() => {
    const value = searchValue.trim();
    if (value !== '') {
      const found = _.filter(healthConditionGroups, c => {
        return c.title.toLowerCase().search(value.toLowerCase()) !== -1;
      });
      setResultHealthConditionGroups(found);
    } else {
      setResultHealthConditionGroups(healthConditionGroups);
    }
  }, [healthConditionGroups, searchValue]);

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

  return (
    <>
      <CardGroup className="healthConditionGroup-container">
        <Card>
          <Card.Header className="px-2 d-flex justify-content-between align-items-start">
            <h5 className="m-0 text-truncate">{translate('setting.health_conditions')}</h5>
            <Button
              aria-label={translate('setting.health_condition_group.new')}
              variant="outline-primary"
              className="btn-circle float-right"
              onClick={() => handleCreate()}
            >
              <BsPlus size={20} />
            </Button>
          </Card.Header>
          <Card.Body className="px-2">
            {healthConditionGroups.length > 0 && (
              <>
                <SearchInput
                  name="search_value"
                  value={searchValue}
                  placeholder={translate('setting.health_condition_group.search')}
                  onChange={e => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue('')}
                />
                <strong>
                  {translate('setting.health_condition_group.number_of_groups', { number: resultHealthConditionGroups.length })}
                </strong>
                <HealthConditionGroupList
                  resultHealthConditionGroups={resultHealthConditionGroups}
                  healthConditionGroups={healthConditionGroups}
                  active={activeSub1}
                  setActive={setActiveSub1}
                  handleEdit={handleEdit}
                />
              </>
            )}
          </Card.Body>
        </Card>
        <HealthConditionCard
          activeHealthConditionGroup={activeSub1}
          active={activeSub2}
          setActive={setActiveSub2}
        />
      </CardGroup>

      {show &&
        <CreateHealthConditionGroup
          show={show}
          editId={editId}
          handleClose={handleClose}
        />
      }
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

HealthCondition.propTypes = {
  translate: PropTypes.func
};

export default withLocalize(HealthCondition);

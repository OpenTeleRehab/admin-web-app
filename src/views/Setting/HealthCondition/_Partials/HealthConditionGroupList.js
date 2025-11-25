import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, ListGroup } from 'react-bootstrap';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import { getTranslate } from 'react-localize-redux';
import Dialog from '../../../../components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { deleteHealthConditionGroup } from '../../../../store/healthConditionGroup/actions';

const HealthConditionGroupList = ({ resultHealthConditionGroups, healthConditionGroups, active, setActive, handleEdit, ...rest }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteHealthConditionGroup(deleteId)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  return resultHealthConditionGroups.length > 0 && (
    <>
      <ListGroup variant="flush" className="border-top border-bottom" {...rest}>
        {resultHealthConditionGroups.map(healthConditionGroup => {
          return (
            <ListGroup.Item
              action
              key={healthConditionGroup.id}
              active={active && active.id === healthConditionGroup.id}
              onClick={() => setActive ? setActive(healthConditionGroup) : undefined}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                {healthConditionGroup.title}{setActive ? ` (${healthConditionGroup.children})` : ''}
                {!healthConditionGroup.children && (
                  <Badge pill variant="light" className="ml-2">
                    {translate('setting.health_condition_group.not_inused')}
                  </Badge>
                )}
              </div>
              <div>
                <DeleteAction onClick={() => handleDelete(healthConditionGroup.id)} disabled={!!healthConditionGroup.children} />
                <EditAction onClick={() => handleEdit(healthConditionGroup.id)} />
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <Dialog
        show={showDeleteDialog}
        title={translate('setting.health_condition_group.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
    </>
  );
};

HealthConditionGroupList.propTypes = {
  resultHealthConditionGroups: PropTypes.array,
  healthConditionGroups: PropTypes.array,
  active: PropTypes.object,
  setActive: PropTypes.func,
  handleEdit: PropTypes.func,
  rest: PropTypes.any
};

export default HealthConditionGroupList;

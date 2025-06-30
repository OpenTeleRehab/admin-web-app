import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, ListGroup } from 'react-bootstrap';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import { getTranslate } from 'react-localize-redux';
import Dialog from '../../../../components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { deleteHealthCondition } from '../../../../store/healthCondition/actions';

const HealthConditionList = ({ resultHealthConditions, healthConditions, active, setActive, handleEdit, ...rest }) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();

  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = (item) => {
    setDeleteItem(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteItem(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteHealthCondition(deleteItem.id, deleteItem.parent_id)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  return resultHealthConditions.length > 0 && (
    <>
      <ListGroup variant="flush" className="border-top border-bottom" {...rest}>
        {resultHealthConditions.map(healthCondition => {
          return (
            <ListGroup.Item
              action
              key={healthCondition.id}
              active={active && active.id === healthCondition.id}
              onClick={() => setActive ? setActive(healthCondition) : undefined}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                {healthCondition.title}
                {!healthCondition.is_used && (
                  <Badge pill variant="light" className="ml-2">
                    {translate('setting.health_condition.not_inused')}
                  </Badge>
                )}
              </div>
              <div>
                <DeleteAction onClick={() => handleDelete(healthCondition)} disabled={healthCondition.is_used} />
                <EditAction onClick={() => handleEdit(healthCondition.id)} />
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <Dialog
        show={showDeleteDialog}
        title={translate('setting.health_condition.delete_confirmation_title')}
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

HealthConditionList.propTypes = {
  resultHealthConditions: PropTypes.array,
  healthConditions: PropTypes.array,
  active: PropTypes.object,
  setActive: PropTypes.func,
  handleEdit: PropTypes.func,
  rest: PropTypes.any
};

export default HealthConditionList;

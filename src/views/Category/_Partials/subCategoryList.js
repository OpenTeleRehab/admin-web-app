import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Badge, ListGroup } from 'react-bootstrap';
import { DeleteAction, EditAction } from 'components/ActionIcons';
import { getTranslate } from 'react-localize-redux';
import Dialog from '../../../components/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory } from '../../../store/category/actions';
import { USER_GROUPS, USER_ROLES } from '../../../variables/user';
import { useKeycloak } from '@react-keycloak/web';

const SubCategoryList = ({ type, subCategories, categories, active, setActive, handleEdit, ...rest }) => {
  const localize = useSelector((state) => state.localize);
  const { profile } = useSelector((state) => state.auth);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const isSuperAdmin = keycloak.hasRealmRole(USER_ROLES.SUPER_ADMIN);

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
    dispatch(deleteCategory(deleteId, type)).then(result => {
      if (result) {
        handleDeleteDialogClose();
      }
    });
  };

  return subCategories.length > 0 && (
    <>
      <ListGroup variant="flush" className="border-top border-bottom" {...rest}>
        {subCategories.map(sub => {
          const childSubCategories = _.filter(categories, c => {
            const showHiOnly = (c.hi_only && isSuperAdmin) || !c.hi_only;
            return c.parent === sub.id && showHiOnly;
          });
          return (
            <ListGroup.Item
              action
              key={sub.id}
              active={active && active.id === sub.id}
              onClick={() => setActive ? setActive(sub) : undefined}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                {sub.title}{setActive ? ` (${childSubCategories.length})` : ''}
                {!sub.is_used && (
                  <Badge pill variant="light" className="ml-2">
                    {translate('category.not_inused')}
                  </Badge>
                )}
                {sub.hi_only && (
                  <Badge pill variant="light" className="ml-2">
                    {translate('category.hi_only')}
                  </Badge>
                )}
              </div>
              <div>
                { profile.type !== USER_GROUPS.ORGANIZATION_ADMIN && !keycloak.hasRealmRole(USER_ROLES.TRANSLATE_CATEGORY) &&
                  <DeleteAction onClick={() => handleDelete(sub.id)} disabled={sub.is_used} />
                }
                { (profile.type !== USER_GROUPS.ORGANIZATION_ADMIN || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_CATEGORY)) &&
                  <EditAction onClick={() => handleEdit(sub.id)} />
                }
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <Dialog
        show={showDeleteDialog}
        title={translate('category.delete_confirmation_title')}
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

SubCategoryList.propTypes = {
  type: PropTypes.string,
  subCategories: PropTypes.array,
  categories: PropTypes.array,
  active: PropTypes.object,
  setActive: PropTypes.func,
  handleEdit: PropTypes.func,
  rest: PropTypes.any
};

export default SubCategoryList;

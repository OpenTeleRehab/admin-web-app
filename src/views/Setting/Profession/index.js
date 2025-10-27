import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

import BasicTable from 'components/Table/basic';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import { deleteProfession } from 'store/profession/actions';
import Dialog from 'components/Dialog';
import customColorScheme from '../../../utils/customColorScheme';
import { useList } from 'hooks/useList';
import { useInvalidate } from 'hooks/useInvalidate';
import { END_POINTS } from 'variables/endPoint';
import _ from 'lodash';

const Profession = ({ translate, handleRowEdit }) => {
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [deleteId, setDeleteId] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const dispatch = useDispatch();
  const invalidate = useInvalidate();
  const { data: professions } = useList('profession/list', {
    page: currentPage,
    page_size: pageSize,
    search: searchValue,
    filters
  });

  useEffect(() => {
    if (professions) {
      setTotalCount(professions.total);
    }
  }, [professions]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchValue]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteDialogConfirm = () => {
    dispatch(deleteProfession(deleteId)).then(result => {
      if (result) {
        invalidate(END_POINTS.PROFESSION_LIST);
        handleDeleteDialogClose();
      }
    });
  };

  const [columns] = useState([
    { name: 'identity', title: translate('common.id') },
    { name: 'profession_name', title: translate('common.name') },
    { name: 'profession_type', title: translate('profession.type') },
    { name: 'action', title: translate('common.action') }
  ]);

  return (
    <div>
      <BasicTable
        rows={(professions?.data || []).map(profession => {
          const action = (
            <>
              <EditAction onClick={() => handleRowEdit(profession.id)}/>
              <DeleteAction className="ml-1" onClick={() => handleDelete(profession.id)} disabled={profession.isUsed}/>
            </>
          );
          return {
            identity: profession.identity,
            profession_name: profession.name,
            profession_type: profession.type ? translate(`profession.type.${profession.type.toLowerCase()}`) : '',
            action
          };
        })}
        columns={columns}
        showSearch={true}
        showPagination={true}
        showFilter={true}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
      />
      <Dialog
        show={showDeleteDialog}
        title={translate('profession.delete_confirmation_title')}
        cancelLabel={translate('common.no')}
        onCancel={handleDeleteDialogClose}
        confirmLabel={translate('common.yes')}
        onConfirm={handleDeleteDialogConfirm}
      >
        <p>{translate('common.delete_confirmation_message')}</p>
      </Dialog>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

Profession.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(Profession);

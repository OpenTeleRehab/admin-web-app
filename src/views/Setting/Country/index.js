import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';

import BasicTable from 'components/Table/basic';
import { EditAction, DeleteAction } from 'components/ActionIcons';
import { getLanguageName } from 'utils/language';
import { getCountries } from 'store/country/actions';
import customColorScheme from '../../../utils/customColorScheme';
import _ from 'lodash';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { Spinner } from 'react-bootstrap';
import { useInvalidate } from 'hooks/useInvalidate';
import { useDelete } from 'hooks/useDelete';
import useToast from 'components/V2/Toast';
import useDialog from 'components/V2/Dialog';
import DeleteCountryConfirmation from './Partial/deleteConfirmation';
import { useAlertDialog } from 'components/V2/AlertDialog';

const Country = ({ translate, handleRowEdit }) => {
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const { showToast } = useToast();
  const { data: countries, isLoading } = useList(END_POINTS.COUNTRY);
  const languages = useSelector(state => state.language.languages);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const dispatch = useDispatch();
  const { mutate: deleteCountry } = useDelete(END_POINTS.COUNTRY);
  const invalidate = useInvalidate();

  const columns = [
    { name: 'id', title: translate('common.id') },
    { name: 'name', title: translate('common.name') },
    { name: 'iso_code', title: translate('common.iso_code') },
    { name: 'phone_code', title: translate('common.phone_code') },
    { name: 'language', title: translate('common.language') },
    { name: 'therapist_limit', title: translate('common.therapist_limit') },
    { name: 'phc_worker_limit', title: translate('common.phc_worker_limit') },
    { name: 'action', title: translate('common.action') }
  ];

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  const handleDelete = (id) => {
    showAlert({
      title: translate('country.delete_confirmation_title'),
      message: translate('common.delete_confirmation_message'),
      closeOnConfirm: false,
      onConfirm: () => {
        openDialog({
          title: translate('country.delete_confirmation_title'),
          content: (
            <DeleteCountryConfirmation
              countryId={id}
              onConfirm={() => {
                deleteCountry(id, {
                  onSuccess: (res) => {
                    invalidate(END_POINTS.COUNTRY_LIMITATION);
                    closeDialog();
                    closeDialog();
                    showToast({
                      title: translate('toast_title.delete_country'),
                      message: translate(res?.message),
                      color: 'success'
                    });
                  }
                });
              }}
            />
          ),
          props: { size: 'lg' }
        });
      }
    });
  };

  if (isLoading) {
    return <Spinner className="loading-icon" animation="border" variant="primary"/>;
  }

  return (
    <div className="card">
      <BasicTable
        rows={countries.data.map(country => {
          const action = (
            <>
              <EditAction onClick={() => handleRowEdit(country.id)} />
              <DeleteAction className="ml-1" onClick={() => handleDelete(country.id)} />
            </>
          );
          return {
            id: country.identity,
            name: country.name,
            iso_code: country.iso_code,
            phone_code: country.phone_code,
            language: getLanguageName(country.language_id, languages),
            therapist_limit: country.therapist_limit,
            phc_worker_limit: country.phc_worker_limit,
            action
          };
        })}
        columns={columns}
      />
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </div>
  );
};

Country.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(Country);

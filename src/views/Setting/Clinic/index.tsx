import { useEffect, useMemo, useState } from 'react';
import { useTranslate } from 'hooks/useTranslate';
import { useSelector, useDispatch } from 'react-redux';
import { EditAction, DeleteAction } from 'components/V2/ActionIcons';
import customColorScheme from '../../../utils/customColorScheme';
import { useList } from 'hooks/useList';
import { useDelete } from 'hooks/useDelete';
import useToast from 'components/V2/Toast';
import useDialog from 'components/V2/Dialog';
import { useAlertDialog } from 'components/V2/AlertDialog';
import CreateEditClinic from './Partial/createEdit';
import { showSpinner } from 'store/spinnerOverlay/actions';
import { IClinic } from '../../../interfaces/IClinic';
import { END_POINTS } from 'variables/endPoint';
import BasicTable from 'components/Table/basic';
import _ from 'lodash';
import DeleteClinicConfirmation from './Partial/deleteConfirmation';
import { useInvalidate } from 'hooks/useInvalidate';
import { getCountryISO } from 'utils/country';

const Clinic = () => {
  const t = useTranslate();
  const { colorScheme } = useSelector((state: any) => state.colorScheme);
  const countries = useSelector((state: any) => state.country.countries);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlertDialog();
  const invalidate = useInvalidate();
  const [pageSize, setPageSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState([]);
  const { data: clinics } = useList<IClinic>(END_POINTS.CLINIC, { page_size: pageSize, search_value: searchValue, filters });
  const { mutate: deleteClinic } = useDelete(END_POINTS.CLINIC);

  useEffect(() => {
    if (clinics) {
      setTotalCount(clinics.total);
    }
  }, [clinics, pageSize, currentPage, searchValue]);

  const columns = useMemo(() => [
    { name: 'identity', title: t('common.id') },
    { name: 'name', title: t('common.name') },
    { name: 'country_iso', title: t('common.country.iso_code') },
    { name: 'region', title: t('common.region') },
    { name: 'province', title: t('common.province') },
    { name: 'therapist_limit', title: t('common.therapist_limit') },
    { name: 'action', title: t('common.action') }
  ], [t]);

  const handleEdit = (clinic: IClinic) => {
    openDialog({
      title: t('clinic.edit'),
      content: <CreateEditClinic clinic={clinic} />,
      props: { size: 'lg' }
    });
  };

  const handleDelete = (id: number) => {
    showAlert({
      title: t('clinic.delete_confirmation_title'),
      message: t('common.delete_confirmation_message'),
      closeOnConfirm: false,
      onConfirm: () => {
        openDialog({
          title: t('clinic.delete_confirmation_title'),
          content: (
            <DeleteClinicConfirmation
              clinicId={id}
              onConfirm={() => {
                dispatch(showSpinner(true));
                deleteClinic(id, {
                  onSuccess: async (res: any) => {
                    dispatch(showSpinner(false));
                    invalidate(END_POINTS.CLINIC);
                    closeDialog();
                    closeDialog();
                    showToast({
                      title: t('toast_title.delete_clinic'),
                      message: t(res.message),
                      color: 'success'
                    });
                  },
                  onError: () => {
                    dispatch(showSpinner(false));
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

  const rows = useMemo(() =>
    (clinics?.data || []).map((clinic) => {
      const action = (
        <>
          <EditAction onClick={() => handleEdit(clinic)} />
          <DeleteAction className="ml-1" onClick={() => handleDelete(clinic.id)} />
        </>
      );

      return {
        identity: clinic.identity,
        name: clinic.name,
        country_iso: getCountryISO(clinic.country_id, countries),
        region: clinic.region?.name,
        province: clinic.province?.name,
        therapist_limit: clinic.therapist_limit,
        action
      };
    }),
    [clinics, handleEdit, handleDelete, countries]
  );

  return (
    <>
      <BasicTable
        showSearch={true}
        showPagination={true}
        showColumnChooser={true}
        showFilter={true}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        setSearchValue={setSearchValue}
        setFilters={setFilters}
        filters={filters}
        columns={columns}
        rows={rows}
      />
    { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

export default Clinic;

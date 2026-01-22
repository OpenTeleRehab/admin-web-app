import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { getStaticPages } from 'store/staticPage/actions';
import { EditAction } from 'components/ActionIcons';
import { USER_GROUPS, USER_ROLES } from '../../../variables/user';
import BasicTable from 'components/Table/basic';
import customColorScheme from '../../../utils/customColorScheme';
import keycloak from '../../../utils/keycloak';
import { useRole } from 'hooks/useRole';

const StaticPage = ({ translate, handleRowEdit }) => {
  const dispatch = useDispatch();
  const { hasAnyRole } = useRole();
  const { staticPages } = useSelector(state => state.staticPage);
  const { colorScheme } = useSelector(state => state.colorScheme);
  const [pages, setPages] = useState(staticPages);
  const columns = [
    { name: 'title', title: translate('static_page.title') },
    { name: 'platform', title: translate('setting.translations.platform') },
    { name: 'action', title: translate('common.action') }
  ];

  useEffect(() => {
    dispatch(getStaticPages({ url: hasAnyRole([USER_ROLES.MANAGE_FAQ_STATIC_PAGE, USER_ROLES.TRANSLATE_STATIC_PAGE]) ? 'faq' : 'about-us' }));
  }, []);

  useEffect(() => {
    setPages(staticPages);
  }, [staticPages]);

  return (
    <>
      <div className="card">
        <BasicTable
          rows={pages.map(staticPage => {
            const action = (
              <>
                {(keycloak.hasRealmRole(USER_ROLES.MANAGE_FAQ_STATIC_PAGE) || keycloak.hasRealmRole(USER_ROLES.MANAGE_ABOUT_US_STATIC_PAGE) || keycloak.hasRealmRole(USER_ROLES.TRANSLATE_STATIC_PAGE)) && (
                  <EditAction className="ml-1" onClick={() => handleRowEdit(staticPage.id)} />
                )}
              </>
            );

            return {
              title: staticPage.title,
              platform: staticPage.platform,
              action
            };
          })}
          columns={columns}
        />
      </div>
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

StaticPage.propTypes = {
  translate: PropTypes.func,
  handleRowEdit: PropTypes.func
};

export default withLocalize(StaticPage);

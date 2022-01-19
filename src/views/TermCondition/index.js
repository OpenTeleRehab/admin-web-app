import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishTermCondition } from 'store/termAndCondition/actions';

import PropTypes from 'prop-types';
import customColorScheme from '../../utils/customColorScheme';
import _ from 'lodash';

const TermConditionPage = ({ translate }) => {
  const dispatch = useDispatch();
  const { publishTermAndConditionPage } = useSelector(state => state.termAndCondition);
  const { colorScheme } = useSelector(state => state.colorScheme);

  useEffect(() => {
    dispatch(getPublishTermCondition());
  }, [dispatch]);

  return (
    <>
      <h2>{translate('profile.tc')}</h2>
      {publishTermAndConditionPage &&
        <div className="page-wrapper">
          <div className="p-3 flex-grow-1" dangerouslySetInnerHTML={{ __html: publishTermAndConditionPage.content }} />
        </div>
      }
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

TermConditionPage.propTypes = {
  translate: PropTypes.func
};

export default TermConditionPage;

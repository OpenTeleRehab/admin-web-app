import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishPrivacyPolicy } from 'store/privacyPolicy/actions';
import PropTypes from 'prop-types';
import customColorScheme from '../../utils/customColorScheme';
import _ from 'lodash';

const PrivacyPolicyPage = ({ translate }) => {
  const dispatch = useDispatch();
  const { publishPrivacyPolicy } = useSelector(state => state.privacyPolicy);
  const { colorScheme } = useSelector(state => state.colorScheme);

  useEffect(() => {
    dispatch(getPublishPrivacyPolicy());
  }, [dispatch]);

  return (
    <>
      <h2>{translate('profile.pp')}</h2>
      {publishPrivacyPolicy &&
        <div className="page-wrapper">
          <div className="p-3 flex-grow-1" dangerouslySetInnerHTML={{ __html: publishPrivacyPolicy.content }} />
        </div>
      }
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
    </>
  );
};

PrivacyPolicyPage.propTypes = {
  translate: PropTypes.func
};

export default PrivacyPolicyPage;

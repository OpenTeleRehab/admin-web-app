import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFaqPage } from 'store/staticPage/actions';
import customColorScheme from '../../utils/customColorScheme';
import _ from 'lodash';
import GoogleTranslationAttribute from '../../components/GoogleTranslationAttribute';

const FaqPage = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);
  const { faqPage } = useSelector(state => state.staticPage);
  const { colorScheme } = useSelector(state => state.colorScheme);

  useEffect(() => {
    dispatch(getFaqPage({
      'url-segment': 'faq',
      platform: 'admin_portal',
      lang: profile && profile.language_id
    }));
  }, [dispatch, profile]);
  return (
    <>
      {faqPage &&
        <div className="page-wrapper">
          {faqPage.file ? (
            <div className="position-relative">
              <img src={`${process.env.REACT_APP_API_BASE_URL}/file/${faqPage.file_id}`} alt="banner" className="image-size"/>
              <div className="p-3 position-absolute title-wrapper">
                {faqPage.title}
              </div>
            </div>
          ) : (
            <h2 className="p-3">
              {faqPage.title}
            </h2>
          )}
          <div className="p-3 flex-grow-1" dangerouslySetInnerHTML={{ __html: faqPage.content }} style={{ color: faqPage.text_color, backgroundColor: faqPage.background_color }} />
        </div>
      }
      { !_.isEmpty(colorScheme) && customColorScheme(colorScheme) }
      { faqPage.auto_translated === true && (
        <GoogleTranslationAttribute />
      )}
    </>
  );
};

export default FaqPage;

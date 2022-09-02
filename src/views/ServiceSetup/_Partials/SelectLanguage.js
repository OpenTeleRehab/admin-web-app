import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import _ from 'lodash';
import scssColors from '../../../scss/custom.scss';
import settings from '../../../settings';
import { Button } from 'react-bootstrap';
import {
  BsFillCaretLeftFill,
  BsFillCaretRightFill
} from 'react-icons/bs';
import { FaLanguage } from 'react-icons/fa';

const { Option } = components;

const SelectLanguage = ({ translate, resource, language, setLanguage, setEditTranslationIndex, setEditTranslations, isDisabled }) => {
  const { languages } = useSelector(state => state.language);
  const [languageObj, setLanguageObj] = useState(null);
  const [editings, setEditings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [getLanguages, setGetLanguages] = useState([]);

  useEffect(() => {
    if (languages && resource) {
      const languageData = [];
      _.forEach(languages, (lang) => {
        const translations = !_.isEmpty(resource) && resource.children.filter(item => item.suggested_lang === lang.code);

        languageData.push({
          id: lang.id,
          label: lang.name,
          code: lang.code,
          length: translations.length,
          icon: <FaLanguage size={20} />
        });
      });

      setGetLanguages(languageData);
    }
  }, [languages, resource]);

  useEffect(() => {
    if (languages.length) {
      const lang = languages.find(lang => language && lang.id.toString() === language.toString());
      if (lang) {
        setLanguageObj(lang);
        setLanguage(lang.id);
      } else {
        setLanguageObj(languages[0]);
        setLanguage(languages[0].id);
      }
    }
    // eslint-disable-next-line
  }, [languages, language]);

  useEffect(() => {
    if (resource && languageObj) {
      const translations = !_.isEmpty(resource) && resource.children.filter(item => item.suggested_lang === languageObj.code);
      setEditings(translations);
      setEditTranslations(translations);
      handleResetIndex();
    }
    // eslint-disable-next-line
  }, [languageObj, resource]);

  const handleResetIndex = () => {
    setCurrentIndex(1);
    setEditTranslationIndex(1);
  };

  const handleSelectLanguage = (e) => {
    setLanguage(e.id);
    setLanguageObj(e);
    handleResetIndex();
  };

  const handlePrevious = () => {
    setCurrentIndex(currentIndex - 1);
    setEditTranslationIndex(currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
    setEditTranslationIndex(currentIndex + 1);
  };

  const customSelectStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: scssColors.infoLight
      }
    })
  };

  return (
    <>
      <Select
        isDisabled={isDisabled}
        classNamePrefix="filter"
        value={getLanguages.filter(option => languageObj && option.id.toString() === languageObj.id.toString())}
        components={{ Option: IconOption }}
        getOptionLabel={option => {
          if (option.length) {
            return option.label + ' - ' + option.length;
          }
          return option.label;
        }}
        options={getLanguages}
        onChange={(e) => handleSelectLanguage(e)}
        styles={customSelectStyles}
      />

      {languageObj && languageObj.code !== settings.locale && !_.isEmpty(editings) &&
        <div className="mt-3 d-md-flex justify-content-between align-items-center">
          <strong>{translate('common.total_edit_translations', { index: currentIndex, total: editings.length })}</strong>
          <div className="cta-edit-translation">
            <Button
              variant="primary"
              size={'sm'}
              disabled={currentIndex === 1}
              onClick={handlePrevious}
            >
              <BsFillCaretLeftFill size={12} /> {translate('common.previous')}
            </Button>

            <Button
              className="ml-2"
              variant="primary"
              size={'sm'}
              disabled={currentIndex === editings.length}
              onClick={handleNext}
            >
              {translate('common.next')} <BsFillCaretRightFill size={12} />
            </Button>
          </div>
        </div>
      }
    </>
  );
};

const IconOption = (props) => {
  const option = props;

  return (
    <Option {...props}>
      {option.data.length
        ? <strong className="text-primary"><span>{option.data.icon}</span> {option.data.label} - {option.data.length}</strong>
        : <span>{option.data.label}</span>
      }
    </Option>
  );
};

SelectLanguage.propTypes = {
  translate: PropTypes.func,
  resource: PropTypes.object,
  setLanguage: PropTypes.func,
  setEditTranslationIndex: PropTypes.func,
  setEditTranslations: PropTypes.func,
  isDisabled: PropTypes.bool,
  language: PropTypes.string
};

export default SelectLanguage;

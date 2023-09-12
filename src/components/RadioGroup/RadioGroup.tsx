import classNames from 'classnames';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import { XMarkIcon } from '../Icons';

interface Radio {
  value: any;
  text: string;
}

interface RadioGroupProps {
  radios: Radio[];
  onChange: (value: any) => void;
  classNameWrapper?: string;
  field: string;
}

const RadioGroup = ({ radios, onChange, classNameWrapper, field }: RadioGroupProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryConfig = queryString.parse(location.search);
  const [activeValue, setActiveValue] = useState<any>(null);

  const handleChange = (value: any) => {
    setActiveValue(value);
    onChange(value);
  };

  const handleCancel = () => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams(omit(queryConfig, [field])).toString()
    });
    setActiveValue(null);
  };

  return (
    <div className={classNameWrapper}>
      <div className='flex items-center'>
        <div className='flex first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md text-sm font-medium overflow-hidden'>
          {radios.map((radio, index) => {
            return (
              <div
                key={index}
                className={classNames('py-1 border px-4 cursor-pointer', {
                  'bg-slate-100': !(radio.value === activeValue),
                  'bg-slate-200 border-slate-200': radio.value === activeValue
                })}
                onClick={() => handleChange(radio.value)}
              >
                {radio.text}
              </div>
            );
          })}
        </div>
        {activeValue !== null && (
          <button className='flex items-center text-xs font-medium ml-2' onClick={handleCancel}>
            <XMarkIcon className='w-3 h-3' />
            <span className='ml-1'>Xóa</span>
          </button>
        )}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  radios: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  classNameWrapper: PropTypes.string,
  field: PropTypes.string.isRequired
};

export default RadioGroup;

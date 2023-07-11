import Tippy from '@tippyjs/react/headless';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { ChevronDown, TickIcon } from '../Icons';
import Wrapper from '../Wrapper';

export interface OptionsSelect {
  value: string;
  text: string;
}

interface SelectProps {
  options: OptionsSelect[];
  label: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  classNameWrapper?: string;
}

const Select = ({ options, label, defaultValue, onChange, classNameWrapper }: SelectProps) => {
  const [activeValue, setActiveValue] = useState<string>(defaultValue || '10');
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const handleChange = (value: string, text?: string) => {
    setActiveValue(value);
    text && setActiveLabel(text);
    onChange && onChange(value);
  };

  const renderOptions = () => (
    <Wrapper>
      <div className='last:border-b-0'>
        {options.map((option, index) => {
          const isActive = activeValue === option.value;
          return (
            <div
              key={index}
              className='flex justify-between items-center cursor-pointer text-sm min-w-[150px] px-6 py-2 select-none border-b text-black/60 hover:bg-slate-100/50'
              onClick={() => handleChange(option.value, option.text)}
            >
              <span>{option.text}</span>
              {isActive && <TickIcon className='w-4 h-4 stroke-primary ml-4' />}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );

  return (
    <Tippy interactive trigger='click' render={renderOptions} placement='bottom-start' offset={[0, 8]}>
      <div
        className={`flex justify-between items-center border px-4 py-1 rounded bg-slate-200/50 text-sm select-none font-medium cursor-pointer ${classNameWrapper}`}
      >
        <span>{activeLabel || label}</span>
        <ChevronDown className='w-3 h-3 ml-5' />
      </div>
    </Tippy>
  );
};

Select.propTypes = {
  options: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  onchange: PropTypes.func
};

export default Select;

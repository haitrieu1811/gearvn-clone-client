import Tippy from '@tippyjs/react/headless';
import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames';

import { ChevronDownIcon, TickIcon } from '../Icons';
import Wrapper from '../Wrapper';

export interface OptionsSelect {
  value: string;
  text: string;
}

type SelectSize = 'Small' | 'Medium' | 'Large' | 'ExtraLarge';

interface SelectProps {
  options: OptionsSelect[];
  label?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  classNameWrapper?: string;
  size?: SelectSize;
}

const Select = ({
  options,
  label = 'Bản ghi mỗi trang',
  defaultValue,
  onChange,
  classNameWrapper,
  size = 'Small'
}: SelectProps) => {
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
              className={classNames(
                'flex justify-between items-center cursor-pointer text-sm min-w-[150px] px-6 select-none border-b text-black/60 hover:bg-slate-100/50',
                {
                  'py-2': size === 'Small',
                  'py-3': size === 'Medium',
                  'py-4': size === 'Large',
                  'py-5': size === 'ExtraLarge'
                }
              )}
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
        className={classNames(
          `flex justify-between items-center border px-4 rounded bg-slate-200/50 text-sm select-none font-medium cursor-pointer ${classNameWrapper}`,
          {
            'py-1': size === 'Small',
            'py-2': size === 'Medium',
            'py-3': size === 'Large',
            'py-4': size === 'ExtraLarge'
          }
        )}
      >
        <span>{activeLabel || label}</span>
        <ChevronDownIcon className='w-3 h-3 ml-5' />
      </div>
    </Tippy>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ).isRequired,
  label: PropTypes.string,
  onchange: PropTypes.func,
  defaultValue: PropTypes.string,
  classNameWrapper: PropTypes.string
};

export default Select;

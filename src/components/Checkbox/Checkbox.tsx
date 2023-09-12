import { InputHTMLAttributes } from 'react';
import PropTypes from 'prop-types';

import { TickIcon } from '../Icons';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  classNameIcon?: string;
}

const Checkbox = ({
  className = 'relative border border-[#cfcfcf] rounded-sm w-4 h-4 flex justify-center items-center',
  classNameIcon = 'w-4 h-4 stroke-primary absolute opacity-0 pointer-events-none peer-checked:opacity-100',
  ...rest
}: CheckboxProps) => {
  return (
    <div className={className}>
      <input type='checkbox' {...rest} className='peer appearance-none w-full h-full cursor-pointer' />
      <TickIcon className={classNameIcon} />
    </div>
  );
};

Checkbox.propTypes = {
  className: PropTypes.string,
  classNameIcon: PropTypes.string
};

export default Checkbox;

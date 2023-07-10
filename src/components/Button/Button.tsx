import { ButtonHTMLAttributes, ReactNode } from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '../Icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  classNameWrapper?: string;
  isLoading?: boolean;
}

const Button = ({
  children,
  className = 'bg-primary w-full text-white capitalize rounded py-2 hover:bg-primary/90 flex items-center justify-center font-medium',
  classNameWrapper,
  isLoading
}: ButtonProps) => {
  return (
    <div className={classNameWrapper}>
      <button className={className} disabled={isLoading}>
        {isLoading && (
          <span className='mr-2'>
            <Spinner />
          </span>
        )}
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  classNameWrapper: PropTypes.string,
  isLoading: PropTypes.bool
};

export default Button;

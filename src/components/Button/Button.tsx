import { ButtonHTMLAttributes, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Spinner } from '../Icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  classNameWrapper?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const Button = ({
  children,
  className = 'bg-primary px-4 py-2 text-white text-sm md:text-base uppercase rounded hover:bg-primary/90 flex items-center justify-center font-medium select-none',
  classNameWrapper,
  isLoading,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <div className={classNameWrapper}>
      <button
        className={classNames(className, {
          'opacity-50 pointer-events-none': disabled
        })}
        disabled={isLoading}
        {...rest}
      >
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
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  classNameWrapper: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Button;

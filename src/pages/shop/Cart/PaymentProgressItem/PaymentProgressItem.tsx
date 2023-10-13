import classNames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';

interface PaymentProgressItemProps {
  isActive: boolean;
  name: string;
  icon: ({
    className,
    circleClassName,
    pathClassName
  }: {
    className?: string;
    circleClassName?: string;
    pathClassName?: string;
  }) => JSX.Element;
  border?: boolean;
}

const PaymentProgressItem = ({ isActive, icon, name, border = true }: PaymentProgressItemProps) => {
  const Icon = icon;
  return (
    <div className='flex justify-center flex-col flex-1'>
      <div
        className={classNames('relative flex justify-center', {
          'before:absolute before:top-1/2 before:right-1/2 before:-translate-y-1/2 before:w-full before:h-[2px] before:border-t':
            border,
          'before:border-dashed before:border-[#6b6868]': !isActive,
          'before:border-solid before:border-primary': isActive
        })}
      >
        <div className='relative z-10'>
          <Icon
            className={classNames('w-7 h-7 relative z-10', {
              'fill-primary': isActive
            })}
            circleClassName={classNames('', {
              'stroke-primary': isActive
            })}
            pathClassName={classNames('', {
              'fill-white': isActive
            })}
          />
        </div>
      </div>
      <p
        className={classNames('mt-1 text-center text-sm md:text-base', {
          'text-[##535353]': !isActive,
          'text-primary': isActive
        })}
      >
        {name}
      </p>
    </div>
  );
};

PaymentProgressItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired
};

export default memo(PaymentProgressItem);

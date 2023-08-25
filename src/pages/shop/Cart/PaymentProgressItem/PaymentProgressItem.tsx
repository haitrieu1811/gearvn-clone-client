import classNames from 'classnames';
import PropTypes from 'prop-types';

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
}

const PaymentProgressItem = ({ isActive, icon, name }: PaymentProgressItemProps) => {
  const Icon = icon;

  return (
    <div className='flex justify-center items-center flex-col flex-1'>
      <div
        className={classNames(
          'relative before:absolute before:top-1/2 before:right-full before:-translate-y-1/2 before:w-[110px] before:h-[2px] before:border-t',
          {
            'before:border-dashed before:border-[#6b6868]': !isActive,
            'before:border-solid before:border-primary': isActive
          }
        )}
      >
        <Icon
          className={classNames('w-7 h-7', {
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
      <p
        className={classNames('mt-1', {
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

export default PaymentProgressItem;

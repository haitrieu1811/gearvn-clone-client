import classNames from 'classnames';
import PropTypes from 'prop-types';

interface OrderTrackingItemProps {
  icon: ({ className, circleClassName }: { className?: string; circleClassName?: string }) => JSX.Element;
  text: string;
  time?: string;
  isActive?: boolean;
  border?: boolean;
}

const OrderTrackingItem = ({ icon, text, time, isActive = false, border = true }: OrderTrackingItemProps) => {
  const Icon = icon;
  return (
    <div className='flex flex-col'>
      <div
        className={classNames('flex justify-center', {
          'relative before:absolute before:top-1/2 before:-translate-y-1/2 before:right-1/2 before:w-full before:h-[1px] md:before:h-[3px]':
            border,
          'before:bg-[#cfcfcf]': border && !isActive,
          'before:bg-[#1E9800]': border && isActive
        })}
      >
        <div className='relative z-[10]'>
          <Icon
            className={classNames('w-9 h-9 md:w-14 md:h-14', {
              'text-[#CFCFCF]': !isActive,
              'text-white': isActive
            })}
            circleClassName={classNames('', {
              'fill-white text-[#cfcfcf]': !isActive,
              'fill-[#1E9800] stroke-white': isActive
            })}
          />
        </div>
      </div>
      <div className='mt-5 mb-1 text-center text-xs md:text-base px-1 md:px-0'>{text}</div>
      {!!time && <div className='text-xs md:text-[13px] text-[#6D6E72] text-center px-1 md:px-0'>{time}</div>}
    </div>
  );
};

OrderTrackingItem.propTypes = {
  icon: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  time: PropTypes.string,
  isActive: PropTypes.bool,
  border: PropTypes.bool
};

export default OrderTrackingItem;

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';

interface TabProps {
  name: string;
  quantity: number;
  isActive: boolean;
  onClick: () => void;
}

const Tab = ({ name, quantity, isActive, onClick }: TabProps) => {
  return (
    <div
      aria-hidden='true'
      tabIndex={0}
      role='button'
      className={classNames(
        'relative whitespace-nowrap text-center uppercase text-[#535353] text-sm md:text-base font-semibold flex-auto px-1 pb-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:duration-200',
        {
          'after:bg-primary text-black after:w-full': isActive,
          'after:bg-transparent after:w-0': !isActive
        }
      )}
      onClick={onClick}
    >
      {name} {isActive && <span className='text-[#FF3C53] text-sm md:text-base ml-[2px]'>({quantity})</span>}
    </div>
  );
};

Tab.propTypes = {
  name: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default memo(Tab);

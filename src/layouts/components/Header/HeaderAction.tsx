import { ReactNode } from 'react';
import PropTypes from 'prop-types';

interface HeaderActionProps {
  textAbove: string;
  textBelow: string;
  icon: ReactNode;
}

const HeaderAction = ({ textAbove, textBelow, icon }: HeaderActionProps) => {
  return (
    <div className='flex items-center ml-7'>
      {icon}
      <div className='text-[13px] text-white ml-3 leading-snug'>
        <div className='font-semibold'>{textAbove}</div>
        <div className='font-semibold'>{textBelow}</div>
      </div>
    </div>
  );
};

HeaderAction.propTypes = {
  textAbove: PropTypes.string.isRequired,
  textBelow: PropTypes.string.isRequired
};

export default HeaderAction;

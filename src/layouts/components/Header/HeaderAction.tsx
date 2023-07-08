import { ReactNode } from 'react';
import PropTypes from 'prop-types';

const HeaderAction = ({ textAbove, textBelow, icon }: { textAbove: string; textBelow: string; icon: ReactNode }) => {
  return (
    <div className='flex items-center ml-7'>
      {icon}
      <div className='text-[13px] text-white font-semibold ml-3 leading-snug'>
        <div>{textAbove}</div>
        <div>{textBelow}</div>
      </div>
    </div>
  );
};

HeaderAction.propTypes = {
  textAbove: PropTypes.string.isRequired,
  textBelow: PropTypes.string.isRequired
};

export default HeaderAction;

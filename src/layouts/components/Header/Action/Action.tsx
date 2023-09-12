import { ReactNode } from 'react';
import PropTypes from 'prop-types';

interface ActionProps {
  textAbove: string;
  textBelow: string;
  icon: ReactNode;
}

const Action = ({ textAbove, textBelow, icon }: ActionProps) => {
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

Action.propTypes = {
  textAbove: PropTypes.string.isRequired,
  textBelow: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};

export default Action;

import PropTypes from 'prop-types';
import { LoadingIcon } from '../Icons';

interface LoadingProps {
  className?: string;
  classNameWrapper?: string;
}

const Loading = ({ className = 'w-8 h-8 md:w-12 md:h-12', classNameWrapper }: LoadingProps) => {
  return (
    <div className={`flex bg-white rounded shadow-sm justify-center py-[120px] ${classNameWrapper}`}>
      <LoadingIcon className={className} />
    </div>
  );
};

Loading.propTypes = {
  className: PropTypes.string,
  classNameWrapper: PropTypes.string
};

export default Loading;

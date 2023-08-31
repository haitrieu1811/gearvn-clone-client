import PropTypes from 'prop-types';
import classNames from 'classnames';

type BadgeType = 'Success' | 'Primary' | 'Danger' | 'Warning' | 'Secondary';

const Badge = ({ name, type = 'Primary' }: { name: string; type?: BadgeType }) => {
  return (
    <div
      className={classNames('border text-xs px-2 rounded-sm inline-flex justify-center items-center', {
        'bg-red-200/20 border-red-200 text-red-500': type === 'Danger',
        'bg-blue-200/20 border-blue-200 text-blue-500': type === 'Primary',
        'bg-green-200/20 border-green-200 text-green-500': type === 'Success',
        'bg-yellow-200/20 border-yellow-200 text-yellow-500': type === 'Warning',
        'bg-gray-200/20 border-gray-200 text-gray-500': type === 'Secondary'
      })}
    >
      {name}
    </div>
  );
};

Badge.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default Badge;

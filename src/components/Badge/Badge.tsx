import PropTypes from 'prop-types';
import classNames from 'classnames';

type BadgeType = 'Success' | 'Primary' | 'Danger' | 'Warning' | 'Secondary';

const Badge = ({ name, type = 'Primary' }: { name: string; type?: BadgeType }) => {
  return (
    <div
      className={classNames('border text-xs px-2 rounded inline-flex justify-center items-center font-medium', {
        'bg-red-100/20 border-red-100 text-red-500': type === 'Danger',
        'bg-blue-100/20 border-blue-100 text-blue-500': type === 'Primary',
        'bg-green-100/20 border-green-100 text-green-500': type === 'Success',
        'bg-yellow-100/20 border-yellow-100 text-yellow-500': type === 'Warning',
        'bg-gray-100/20 border-gray-100 text-gray-500': type === 'Secondary'
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

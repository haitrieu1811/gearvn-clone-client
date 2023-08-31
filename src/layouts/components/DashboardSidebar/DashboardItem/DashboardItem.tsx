import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ReactNode } from 'react';

interface DashboardItemProps {
  name: string;
  path: string;
  icon?: ReactNode;
  end?: boolean;
}

const DashboardItem = ({ name, path, icon, end }: DashboardItemProps) => {
  return (
    <NavLink
      end={end}
      to={path}
      className={({ isActive }) =>
        classNames('flex items-center rounded-tr-sm rounded-br-sm py-2 px-5 mt-1', {
          'hover:bg-slate-100': !isActive,
          'bg-gradient-to-r from-sky-500/30 to-indigo-500/30': isActive
        })
      }
    >
      {icon}
      <span className='text-[15px] capitalize font-medium ml-3'>{name}</span>
    </NavLink>
  );
};

DashboardItem.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  end: PropTypes.bool
};

export default DashboardItem;

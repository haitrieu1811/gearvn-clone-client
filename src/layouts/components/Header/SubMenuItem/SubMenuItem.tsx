import { Fragment, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PATH from 'src/constants/path';

interface SubMenuItemProps {
  icon: ReactNode;
  name: string;
  separate?: boolean;
  to?: string;
}

const SubMenuItem = ({ icon, name, separate, to = PATH.HOME }: SubMenuItemProps) => {
  return (
    <Fragment>
      <Link to={to} className='flex items-center px-8 my-[10px] hover:text-primary'>
        {icon}
        <span className='font-semibold text-[13px] ml-2'>{name}</span>
      </Link>
      {separate && <div className='w-[1px] h-6 bg-[#CFCFCF]'></div>}
    </Fragment>
  );
};

SubMenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  separate: PropTypes.bool
};

export default SubMenuItem;

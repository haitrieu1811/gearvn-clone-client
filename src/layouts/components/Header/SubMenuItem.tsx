import { Fragment, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PATH from 'src/constants/path';

const SubMenuItem = ({ icon, name, separate = false }: { icon: ReactNode; name: string; separate?: boolean }) => {
  return (
    <Fragment>
      <Link to={PATH.HOME} className='flex items-center px-8 my-[10px] hover:text-red-500'>
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
